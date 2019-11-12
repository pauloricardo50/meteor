// @flow
import React from 'react';
import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import Irs10yDialogFormContainer from './Irs10yDialogFormContainer';

type ModifyIrs10yDialogFormProps = {
  schema: Object,
  modifyIrs10y: Function,
  removeIrs10y: Function,
  open: boolean,
  setOpen: Function,
  irs10yToModify: Object,
  submitting: boolean,
};

const ModifyIrs10ytRatesDialogForm = ({
  schema,
  modifyIrs10y,
  removeIrs10y,
  open,
  setOpen,
  irs10yToModify,
  submitting,
}: ModifyIrs10yDialogFormProps) => (
  <AutoFormDialog
    noButton
    schema={schema}
    model={irs10yToModify}
    onSubmit={modifyIrs10y}
    open={open}
    setOpen={setOpen}
    submitting={submitting}
    renderAdditionalActions={({ disabled, setDisableActions }) => (
      <Button
        label={<T id="InterestRates.remove" />}
        error
        outlined
        onClick={() => {
          setDisableActions(true);
          return removeIrs10y(irs10yToModify._id).finally(() =>
            setDisableActions(false),
          );
        }}
      />
    )}
  />
);

export default Irs10yDialogFormContainer(ModifyIrs10ytRatesDialogForm);
