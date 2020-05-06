import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';

import RevenueDialogFormContainer from './RevenueDialogFormContainer';

const RevenueModifier = ({
  schema,
  modifyRevenue,
  model,
  open,
  setOpen,
  submitting,
  deleteRevenue,
  layout,
  description,
}) => (
  <AutoFormDialog
    noButton
    schema={schema}
    model={model}
    onSubmit={modifyRevenue}
    open={open}
    setOpen={setOpen}
    submitting={submitting}
    onDelete={() => deleteRevenue(model._id)}
    title="Modifier un revenu"
    layout={layout}
    description={description}
  />
);

export default RevenueDialogFormContainer(RevenueModifier);
