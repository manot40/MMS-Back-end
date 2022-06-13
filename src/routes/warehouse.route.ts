import { Router } from 'express';

// Middleware

// Schemas

// Controllers
import { getWarehouseHandler, getWarehousesHandler } from '../controllers/warehouse.controller';

let route = Router();

route.get('/', getWarehousesHandler);
route.get('/:warehouseId', getWarehouseHandler);

export default route;
