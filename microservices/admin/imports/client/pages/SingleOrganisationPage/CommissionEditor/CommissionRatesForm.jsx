// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import { OrganisationSchema } from 'core/api/organisations/organisations';
import CommissionRatesFormContainer from './CommissionRatesFormContainer';

type CommissionRatesFormProps = {};

const CommissionRatesForm = ({
  commissionRates,
  onSubmit,
}: CommissionRatesFormProps) => (
  <AutoFormDialog
    schema={OrganisationSchema.pick('commissionRates')}
    model={{ commissionRates }}
    onSubmit={onSubmit}
    buttonProps={{ label: 'Modifier', raised: true, primary: true }}
  />
);

export default CommissionRatesFormContainer(CommissionRatesForm);
