import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import { OrganisationSchema } from 'core/api/organisations/organisations';
import CommissionRatesFormContainer from './CommissionRatesFormContainer';

const CommissionRatesForm = ({ commissionRates, onSubmit }) => (
  <AutoFormDialog
    schema={OrganisationSchema.pick('commissionRates')}
    model={{ commissionRates }}
    onSubmit={onSubmit}
    buttonProps={{ label: 'Modifier', raised: true, primary: true }}
  />
);

export default CommissionRatesFormContainer(CommissionRatesForm);
