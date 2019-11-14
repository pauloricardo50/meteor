// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
import RevenueDialogFormContainer from './RevenueDialogFormContainer';

type RevenueAdderProps = {
  schema: Object,
  insertRevenue: Function,
};

const RevenueAdder = ({
  schema,
  insertRevenue,
  layout,
  description,
  open,
  setOpen,
  model,
}: RevenueAdderProps) => (
  <AutoFormDialog
    schema={schema}
    model={model}
    onSubmit={insertRevenue}
    buttonProps={{ label: 'Insérer un revenu', raised: true, primary: true }}
    title="Insérer un revenu"
    layout={layout}
    description={description}
    open={open}
    setOpen={setOpen}
  />
);

export default RevenueDialogFormContainer(RevenueAdder);
