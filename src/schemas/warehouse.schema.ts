import { object, string } from 'yup';

const params = {
  params: object({
    warehouseId: string().required('Warehouse ID is required'),
  }),
};
const payload = {
  body: object({
    name: string(),
    address: string(),
  }),
};

export const createWarehouseSchema = object({
  ...payload,
});

export const updateWarehouseSchema = object({
  ...params,
  ...payload,
});

export const deleteWarehouseSchema = object({
  ...params,
});
