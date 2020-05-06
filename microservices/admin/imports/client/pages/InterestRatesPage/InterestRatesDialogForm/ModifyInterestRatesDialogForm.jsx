import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
import Button from 'core/components/Button';
import T from 'core/components/Translation';

import InterestRatesDialogFormContainer from './InterestRatesDialogFormContainer';

const ModifyInterestRatesDialogForm = ({
  schema,
  modifyInterestRates,
  removeInterestRates,
  fields,
  open,
  setOpen,
  interestRatesToModify,
  submitting,
}) => (
  <AutoFormDialog
    emptyDialog
    noButton
    schema={schema}
    model={interestRatesToModify}
    onSubmit={modifyInterestRates}
    open={open}
    setOpen={setOpen}
    submitting={submitting}
    onDelete={() => removeInterestRates(interestRatesToModify._id)}
  >
    {() => fields}
  </AutoFormDialog>
);

export default InterestRatesDialogFormContainer(ModifyInterestRatesDialogForm);
