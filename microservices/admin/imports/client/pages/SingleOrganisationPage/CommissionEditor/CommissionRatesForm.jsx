import React from 'react';

import CommissionRateSchema from 'core/api/commissionRates/schemas/CommissionRateSchema';
import { AutoFormDialog } from 'core/components/AutoForm2';

import CommissionRatesFormContainer from './CommissionRatesFormContainer';

const schema = CommissionRateSchema.pick('type', 'rates');

const CommissionRatesForm = ({ commissionRates, onSubmit }) => (
  <AutoFormDialog
    schema={schema}
    model={{ commissionRates }}
    onSubmit={onSubmit}
    buttonProps={{ label: 'Modifier', raised: true, primary: true }}
  />
);

export default CommissionRatesFormContainer(CommissionRatesForm);
