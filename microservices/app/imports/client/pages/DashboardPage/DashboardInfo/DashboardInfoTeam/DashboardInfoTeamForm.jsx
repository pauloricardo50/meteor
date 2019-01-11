import React from 'react';
import SimpleSchema from 'simpl-schema';

import T from 'core/components/Translation';
import { AutoFormDialog } from 'imports/core/components/AutoForm2';

const schema = new SimpleSchema({
  name: String,
  title: String,
  email: { type: String, regEx: SimpleSchema.RegEx.EmailWithTLD },
  phoneNumber: String,
});

const DashboardInfoTeamForm = props => (
  <AutoFormDialog
    schema={schema}
    title={<T id="DashboardInfoTeamForm.dialogTitle" />}
    description={<T id="DashboardInfoTeamForm.dialogDescription" />}
    {...props}
  />
);

export default DashboardInfoTeamForm;
