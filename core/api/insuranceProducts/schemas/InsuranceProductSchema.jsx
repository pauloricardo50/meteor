import React from 'react';
import SimpleSchema from 'simpl-schema';

import { updatedAt, createdAt } from '../../helpers/sharedSchemas';
import {
  INSURANCE_PRODUCT_TYPES,
  INSURANCE_PRODUCT_CATEGORIES,
} from '../insuranceProductConstants';
import T from '../../../components/Translation';

const InsuranceProductSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  name: {
    type: String,
    uniforms: {
      placeholder: 'FlexSave Duo',
    },
  },
  type: {
    type: String,
    allowedValues: Object.values(INSURANCE_PRODUCT_TYPES),
    uniforms: { transform: type => <T id={`InsuranceProduct.type.${type}`} /> },
  },
  category: {
    type: String,
    allowedValues: Object.values(INSURANCE_PRODUCT_CATEGORIES),
    uniforms: {
      transform: category => <T id={`InsuranceProduct.category.${category}`} />,
    },
  },
  revaluationFactor: { type: Number, min: 0.01, max: 10 },
  organisationLink: { type: Object, optional: true },
  'organisationLink._id': String,
});

export default InsuranceProductSchema;
