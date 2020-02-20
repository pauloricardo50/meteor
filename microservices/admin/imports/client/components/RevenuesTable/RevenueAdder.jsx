import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
import Icon from 'core/components/Icon';
import RevenueDialogFormContainer from './RevenueDialogFormContainer';

const RevenueAdder = ({
  schema,
  insertRevenue,
  layout,
  description,
  open,
  setOpen,
  model,
}) => (
  <AutoFormDialog
    schema={schema}
    model={model}
    onSubmit={insertRevenue}
    buttonProps={{
      label: 'Revenu',
      raised: true,
      primary: true,
      icon: <Icon type="add" />,
    }}
    title="Insérer un revenu"
    layout={layout}
    description={description}
    open={open}
    setOpen={setOpen}
  />
);

export default RevenueDialogFormContainer(RevenueAdder);
