import SimpleSchema from 'simpl-schema';

import { address, moneyField } from '../../api/helpers/sharedSchemas';
import { previousLoanTranchesSchema } from '../../api/loans/schemas/otherSchemas';
import { RESIDENCE_TYPE } from '../../api/properties/propertyConstants';

const refinancingPropertySchema = new SimpleSchema({
  address1: String,
  city: address.city,
  country: { ...address.country, optional: false },
  value: {
    ...moneyField,
    optional: false,
    uniforms: {
      helperText: "La valeur estimée aujourd'hui",
      ...moneyField.uniforms,
    },
  },
  zipCode: { ...address.zipCode, optional: false },
  residenceType: {
    type: String,
    allowedValues: Object.values(RESIDENCE_TYPE),
  },
  ...previousLoanTranchesSchema,
  previousLoanTranches: {
    ...previousLoanTranchesSchema.previousLoanTranches,
    custom() {
      const propertyValue = this.field('value').value;
      const tranches = this.value || [];
      const loanValue = tranches.reduce((t, { value }) => t + value, 0);
      if (loanValue > propertyValue) {
        return 'loanValueTooHigh';
      }
    },
    minCount: 1,
  },
});

export default refinancingPropertySchema;
