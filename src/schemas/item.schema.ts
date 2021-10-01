import { array, object, string } from "yup";

const params = {
  params: object({
    itemId: string().required("Item ID is required"),
  }),
};
const payload = {
  body: object({
    name: string(),
    unit: string().matches(
      /(PCS|KG|LTR|BTL|SET|PSG|MTR|GLN)/,
      "Item unit must contain either PCS, KG, LTR, BTL, SET, PSG"
    ),
    type: string().matches(
      /(chemical|consumable)/,
      "Item type must contain either consumable or chemical"
    ),
  }),
};

export const createItemSchema = object({
  ...payload,
});

export const createManySchema = object({
  body: object({
    items: array(
      object({
        name: string(),
        unit: string(),
        type: string().matches(
          /(chemical|consumable)/,
          "Item type must contain either consumable or chemical"
        ),
      })
    ),
  }),
});

export const updateItemSchema = object({
  ...params,
  ...payload,
});

export const deleteItemSchema = object({
  ...params,
});
