import React from 'react';
import SimpleSchema from 'simpl-schema';

import T from '../../../components/Translation';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import {
  INSURANCE_PRODUCT_CATEGORIES,
  INSURANCE_PRODUCT_FEATURES,
} from '../insuranceProductConstants';

const InsuranceProductSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  name: {
    type: String,
    uniforms: {
      placeholder: 'FlexSave Duo',
    },
  },
  category: {
    type: String,
    allowedValues: Object.values(INSURANCE_PRODUCT_CATEGORIES),
    uniforms: {
      transform: category => <T id={`InsuranceProduct.category.${category}`} />,
    },
  },
  features: {
    type: Array,
    uniforms: {
      label: 'Prestations',
      checkboxes: true,
      allowNull: false,
      displayEmpty: false,
    },
  },
  'features.$': {
    type: String,
    allowedValues: Object.values(INSURANCE_PRODUCT_FEATURES),
    uniforms: {
      transform: feature => <T id={`InsuranceProduct.features.${feature}`} />,
    },
  },
  revaluationFactor: { type: Number, min: 0.01, max: 10 },
  maxProductionYears: { type: Number, min: 0 },
  organisationLink: { type: Object, optional: true },
  'organisationLink._id': String,
});

export default InsuranceProductSchema;
