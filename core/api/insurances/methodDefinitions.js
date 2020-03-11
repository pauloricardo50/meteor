import { Method } from '../methods/methods';

export const insuranceInsert = new Method({
  name: 'insuranceInsert',
  params: {
    insuranceRequestId: String,
    borrowerId: String,
    organisationId: String,
    insuranceProductId: String,
    insurance: Object,
  },
});
