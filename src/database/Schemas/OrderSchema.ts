import { SchemaTypes } from ".";

export const OrderSchema = {
  name: SchemaTypes.Order,
  primaryKey: "_id",
  properties: {
    _id: "string",
    patrimony: "string",
    equipment: "string",
    description: "string",
    status: "string",
    created_at: "date",
  },
};
