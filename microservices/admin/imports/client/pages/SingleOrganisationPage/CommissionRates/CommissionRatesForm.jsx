import React from 'react';

import CommissionRateSchema from 'core/api/commissionRates/schemas/CommissionRateSchema';
import { AutoFormDialog } from 'core/components/AutoForm2';

import CommissionRatesFormContainer from './CommissionRatesFormContainer';

const CommissionRatesForm = ({ commissionRates, onSubmit }) => (
  <AutoFormDialog
    schema={CommissionRateSchema.pick('rates')}
    model={commissionRates}
    onSubmit={onSubmit}
    buttonProps={{ label: 'Modifier structure', raised: true, primary: true }}
    title="Structure de commissionnement"
  />
);

export default CommissionRatesFormContainer(CommissionRatesForm);
