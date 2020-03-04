import { withProps } from 'recompose';

import InsuranceProductSchema from 'core/api/insuranceProducts/schemas/InsuranceProductSchema';
import {
  insuranceProductInsert,
  insuranceProductUpdate,
  insuranceProductRemove,
} from 'core/api/methods';

export default withProps(
  ({
    organisationId,
    insuranceProduct: { _id: insuranceProductId } = {},
    setOpen,
  }) => ({
    schema: InsuranceProductSchema.omit(
      'createdAt',
      'updatedAt',
      'organisationLink',
    ),
    insertInsuranceProduct: values =>
      insuranceProductInsert.run({
        insuranceProduct: {
          organisationLink: { _id: organisationId },
          ...values,
        },
      }),
    updateInsuranceProduct: values =>
      insuranceProductUpdate
        .run({ insuranceProductId, object: values })
        .then(() => setOpen(false)),
    removeInsuranceProduct: () =>
      insuranceProductRemove
        .run({ insuranceProductId })
        .then(() => setOpen(false)),
  }),
);
