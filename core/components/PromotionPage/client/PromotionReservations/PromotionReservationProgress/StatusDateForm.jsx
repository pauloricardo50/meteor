// @flow
import React from 'react';

import Dialog from 'core/components/Material/Dialog';
import AutoForm from '../../../../AutoForm2';
import Button from '../../../../Button';
import T from '../../../../Translation';
import StatusDateFormContainer from './StatusDateFormContainer';

type StatusDateFormProps = {};

const StatusDateForm = ({
  model,
  id,
  promotionOptionId,
  onSubmit,
  openDialog,
  dialogProps,
  dialogActions,
  autosave,
  schema,
  layout,
  submitFieldProps,
}: StatusDateFormProps) => (
  <>
    <AutoForm
      autosave={autosave}
      autosaveDelay={0}
      schema={schema}
      model={model}
      onSubmit={onSubmit}
      className="status-date-form"
      id={`${id}-form`}
      fullWidth={false}
      layout={layout}
      submitFieldProps={submitFieldProps}
    />
    <Dialog
      open={openDialog}
      actions={[
        <Button
          label={<T id="general.no" />}
          onClick={dialogActions.cancel}
          key="cancel"
        />,
        <Button
          label={<T id="general.yes" />}
          primary
          onClick={dialogActions.ok}
          key="ok"
        />,
      ]}
      {...dialogProps}
    />
  </>
);

export default StatusDateFormContainer(StatusDateForm);
