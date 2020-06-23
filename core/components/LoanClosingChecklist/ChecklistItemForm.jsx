import React from 'react';
import SimpleSchema from 'simpl-schema';

import AutoformDialog from '../AutoForm2/AutoFormDialog';

const schema = new SimpleSchema({
  title: String,
  description: { type: String, optional: true },
  requiresDocument: { type: Boolean, defaultValue: false },
});

const ChecklistItemForm = ({ model, onSubmit, ...props }) => (
  <AutoformDialog
    model={model}
    onSubmit={onSubmit}
    schema={schema}
    {...props}
  />
);

export default ChecklistItemForm;
