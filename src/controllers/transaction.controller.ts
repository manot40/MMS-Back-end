import type { TransactionDocument as ITrxItem } from 'models/transaction.model';
import dayjs from 'dayjs';
import XLSX from 'xlsx';
import queryHandler from '../helpers/queryHandler';
import { customAlphabet as nanoid } from 'nanoid';
import { Response, Request } from 'express';
import { get } from 'lodash';
import log from '../helpers/pino';
import msg from '../helpers/messenger';
import {
  createTransaction,
  updateTransaction,
  findTransaction,
  getTransactions,
  deleteTransaction,
  checkIfTrxExist,
  countTransactions,
} from '../services/transaction.service';

async function verifyRequestIntegrity(_id: String, user: String, role: String) {
  if (!(await checkIfTrxExist({ _id }))) return '404';
  if (role !== 'admin') {
    if (!(await checkIfTrxExist({ _id, user, status: 'draft' }))) return '403';
  }
}

function mergeDuplicate(arr: ITrxItem['items']) {
  const obj: any = {};
  // @ts-ignore
  const distinct: ITrxItem['items'] = [];
  for (var i; (i = arr.shift()); obj[i.item] = +i.quantity + (+obj[i.item] || 0));
  for (var x in obj) distinct.push({ item: x, quantity: +obj[x] });
  return distinct;
}

export async function createTransactionHandler(req: Request, res: Response) {
  const user = get(req, 'user._id');
  const { body } = req;
  body.items = mergeDuplicate(body.items);
  body.status && delete body.status;
  const randId = nanoid('1234567890ABCDEF', 6);
  const txId = 'TRX-' + body.type.toUpperCase() + '-' + randId();

  await createTransaction({ ...body, txId, user: user })
    .then((data) => {
      return res.status(201).send(msg(201, data));
    })
    .catch((err) => {
      log.warn('Request Rejected on CreateTransaction | ' + err.message);
      return res.status(500).send(msg(500, err.errors, err._message));
    });
}

export async function getTransactionHandler(req: Request, res: Response) {
  const param = get(req, 'params.trxId');

  await findTransaction({ _id: param })
    .then((data) => {
      if (!data) return res.status(404).send(msg(404, {}));
      return res.status(200).send(msg(201, data));
    })
    .catch((err) => {
      log.warn('Request Rejected on GetTransaction | ' + err.message);
      return res.status(500).send(msg(500, err.errors, err._message));
    });
}

export async function getTransactionsHandler(req: Request, res: Response) {
  let { filter, options } = queryHandler(
    {
      populate: [
        { path: 'user', select: 'name' },
        { path: 'warehouse', select: 'name' },
        { path: 'items.item', select: 'name' },
      ],
      sort: { txDate: 'desc' },
      limit: 10,
      ...req.query,
    },
    'description'
  );
  if (req.query.filter) {
    filter = { ...filter, ...(req.query.filter as Object) };
  }

  const itemCount = await countTransactions({ ...filter }).catch(() => 0);
  await getTransactions({ ...filter }, { ...options })
    .then((data) => {
      const response = msg(200, data);
      const totalPages = options.limit ? Math.ceil(itemCount / options.limit) : 1;
      return res.status(200).send({ ...response, itemCount, totalPages });
    })
    .catch((err) => {
      log.warn('Request Rejected on GetTransactions | ' + err.message);
      return res.status(500).send(msg(500, err.errors, err._message));
    });
}

export async function updateTransactionHandler(req: Request, res: Response) {
  const id = get(req, 'params.trxId');
  const role = get(req, 'user.role');
  const user = get(req, 'user._id');
  const body = { ...req.body, user };
  body.items = mergeDuplicate(body.items);

  const validity = await verifyRequestIntegrity(id, user, role);
  if (validity === '404') return res.status(404).send(msg(404, {}));
  if (validity === '403') return res.status(403).send(msg(403, {}));

  // Flush item array first
  await updateTransaction({ _id: id, status: 'draft' }, { $set: { items: [] } }, {}).catch((err) => {
    log.warn('Request Rejected on UpdateTransaction Flush | ' + err.message);
    return res.status(500).send(msg(500, err.errors, err._message));
  });
  // Update transaction
  await updateTransaction({ _id: id }, body, {
    new: true,
  })
    .then((data) => {
      return res.status(200).send(msg(200, data, 'Update data berhasil!'));
    })
    .catch((err) => {
      log.warn('Request Rejected on UpdateTransaction | ' + err.message);
      return res.status(500).send(msg(500, err.errors, err._message));
    });
}

export async function deleteTransactionHandler(req: Request, res: Response) {
  const id = get(req, 'params.trxId');
  const role = get(req, 'user.role');
  const user = get(req, 'user._id');

  const validity = await verifyRequestIntegrity(id, user, role);
  if (validity === '404') return res.status(404).send(msg(404, {}));
  if (validity === '403') return res.status(403).send(msg(403, {}));

  await deleteTransaction({ _id: id, status: 'draft' })
    .then((data) => {
      if (!data) return res.status(404).send(msg(404, {}));
      return res.status(200).send(msg(201, data, 'Data berhasil dihapus'));
    })
    .catch((err) => {
      log.warn('Request Rejected on DeleteTransaction | ' + err.message);
      return res.status(500).send(msg(500, err.errors, err._message));
    });
}

export function exportTransactionsHandler(req: Request, res: Response) {
  const { startDate, endDate, warehouse } = req.query;
  const filter = {
    txDate: {
      $gte: dayjs(startDate + 'T00:00:00Z').toDate(),
      $lte: dayjs(endDate + 'T00:00:00Z').toDate(),
    },
  };
  if (warehouse) Object.assign(filter, { warehouse });

  if (!startDate || !endDate)
    return res.status(400).send(msg(400, null, 'Query invalid, "startDate" and "endDate" required!'));

  getTransactions(
    { ...filter },
    {
      populate: [
        { path: 'warehouse', select: 'name' },
        { path: 'items.item', select: 'name' },
      ],
    }
  )
    .then((data) => {
      let expData: any = [];
      data.forEach((e1) => {
        e1.items.forEach((e2) =>
          expData.push({
            date: dayjs(e1.txDate).format('DD-MM-YYYY'),
            name: e2.item.name,
            qty: e2.quantity,
            type: e1.type,
            warehouse: e1.warehouse.name,
            description: e1.description,
          })
        );
      });
      var WB = XLSX.utils.book_new();
      var WS = XLSX.utils.json_to_sheet(expData);
      XLSX.utils.book_append_sheet(WB, WS, 'transactions');
      const buffer = XLSX.write(WB, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'base64',
      });
      return res
        .writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']])
        .end(Buffer.from(buffer, 'base64'));
    })
    .catch((err) => {
      log.warn('Request Rejected on ExportTransactions | ' + err.message);
      return res.status(500).send(msg(500, err.errors, err._message));
    });
}
