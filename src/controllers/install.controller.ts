import { Response, Request } from 'express';
import XLSX from 'xlsx';

export async function importItemsFromExcel(req: Request, res: Response) {
  const { Sheets } = XLSX.read(req.file.buffer);
  const converted = XLSX.utils.sheet_to_json(Sheets['data']);
  res.send(converted);
}
