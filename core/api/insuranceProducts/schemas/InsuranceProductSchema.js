import SimpleSchema from 'simpl-schema';

import { updatedAt, createdAt } from '../../helpers/sharedSchemas';
import {
  INSURANCE_PRODUCT_TYPES,
  INSURANCE_PRODUCT_CATEGORIES,
} from '../insuranceProductConstants';

const InsuranceProductSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  type: { type: String, allowedValues: Object.values(INSURANCE_PRODUCT_TYPES) },
  category: {
    type: String,
    allowedValues: Object.values(INSURANCE_PRODUCT_CATEGORIES),
  },
  name: String,
  revaluationFactor: { type: Number, min: 0.01, max: 10 },
  organisationLink: Object,
  'organisationLink._id': String,
});

export default InsuranceProductSchema;
