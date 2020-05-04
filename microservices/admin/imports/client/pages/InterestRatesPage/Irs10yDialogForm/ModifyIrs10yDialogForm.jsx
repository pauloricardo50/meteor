import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';

import Irs10yDialogFormContainer from './Irs10yDialogFormContainer';

const ModifyIrs10ytRatesDialogForm = ({
  schema,
  modifyIrs10y,
  removeIrs10y,
  open,
  setOpen,
  irs10yToModify,
  submitting,
}) => (
  <AutoFormDialog
    noButton
    schema={schema}
    model={irs10yToModify}
    onSubmit={modifyIrs10y}
    open={open}
    setOpen={setOpen}
    submitting={submitting}
    onDelete={() => removeIrs10y(irs10yToModify._id)}
  />
);

export default Irs10yDialogFormContainer(ModifyIrs10ytRatesDialogForm);
