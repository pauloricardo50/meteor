import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';

import RevenueDialogFormContainer from './RevenueDialogFormContainer';

const RevenueModifier = ({
  schema,
  modifyRevenue,
  model,
  open,
  setOpen,
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
    onDelete={() => deleteRevenue(model._id)}
    title="Modifier un revenu"
    layout={layout}
    description={description}
  />
);

export default RevenueDialogFormContainer(RevenueModifier);
