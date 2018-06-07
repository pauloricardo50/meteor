import React from 'react';

import { DialogForm, email } from 'core/components/Form';
import T from 'core/components/Translation';

const formArray = [
  { id: 'name' },
  { id: 'title' },
  { id: 'email', validate: [email] },
  { id: 'phone' },
].map(field => ({
  ...field,
  label: <T id={`DashboardInfoTeamForm.${field.id}`} />,
  required: true,
}));

const DashboardInfoTeamForm = props => (
  <DialogForm
    form="add-contact"
    formArray={formArray}
    title={<T id="DashboardInfoTeamForm.dialogTitle" />}
    description={<T id="DashboardInfoTeamForm.dialogDescription" />}
    {...props}
  />
);

export default DashboardInfoTeamForm;
