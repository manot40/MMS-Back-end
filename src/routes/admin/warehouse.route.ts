import { Router } from 'express';

// Helpers
import validateRequest from '../../helpers/validateRequest';

// Schemas
import { createWarehouseSchema, updateWarehouseSchema, deleteWarehouseSchema } from '../../schemas/warehouse.schema';

// Controllers
import {
  createWarehouseHandler,
  updateWarehouseHandler,
  deleteWarehouseHandler,
} from '../../controllers/warehouse.controller';

let route = Router();

route.post('/', validateRequest(createWarehouseSchema), createWarehouseHandler);
route.put('/:warehouseId', validateRequest(updateWarehouseSchema), updateWarehouseHandler);
route.delete('/:warehouseId', validateRequest(deleteWarehouseSchema), deleteWarehouseHandler);

export default route;
