import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import CommissionRateSchema from 'core/api/commissionRates/schemas/CommissionRateSchema';
import CommissionRatesFormContainer from './CommissionRatesFormContainer';

const CommissionRatesForm = ({ commissionRates, onSubmit }) => (
  <AutoFormDialog
    schema={CommissionRateSchema.pick('rates')}
    model={commissionRates}
    onSubmit={onSubmit}
    buttonProps={{ label: 'Modifier', raised: true, primary: true }}
  />
);

export default CommissionRatesFormContainer(CommissionRatesForm);
