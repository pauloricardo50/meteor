import { Method } from '../methods/methods';

export const insuranceProductInsert = new Method({
  name: 'insuranceProductInsert',
  params: { insuranceProduct: Object },
});

export const insuranceProductRemove = new Method({
  name: 'insuranceProductRemove',
  params: { insuranceProductId: String },
});

export const insuranceProductUpdate = new Method({
  name: 'insuranceProductUpdate',
  params: { insuranceProductId: String, object: Object },
});
