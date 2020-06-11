import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';

import InterestRatesDialogFormContainer from './InterestRatesDialogFormContainer';

const ModifyInterestRatesDialogForm = ({
  schema,
  modifyInterestRates,
  removeInterestRates,
  fields,
  open,
  setOpen,
  interestRatesToModify,
}) => (
  <AutoFormDialog
    emptyDialog
    noButton
    schema={schema}
    model={interestRatesToModify}
    onSubmit={modifyInterestRates}
    open={open}
    setOpen={setOpen}
    onDelete={() => removeInterestRates(interestRatesToModify._id)}
  >
    {() => fields}
  </AutoFormDialog>
);

export default InterestRatesDialogFormContainer(ModifyInterestRatesDialogForm);
