import React from 'react';

import { AutoFormDialog } from '../../AutoForm2/AutoFormDialog';
import Button from '../../Button';
import Dialog from '../../Material/Dialog';
import T from '../../Translation';
import StatusDateDialogFormContainer from './StatusDateDialogFormContainer';

const StatusDateDialogForm = ({
  openConfirmDialog,
  confirmDialogActions,
  confirmDialogProps,
  ...props
}) => (
  <>
    <AutoFormDialog {...props} noButton />
    <Dialog
      open={openConfirmDialog}
      actions={[
        <Button
          label={<T id="general.no" />}
          onClick={confirmDialogActions.cancel}
          key="cancel"
        />,
        <Button
          label={<T id="general.yes" />}
          primary
          onClick={confirmDialogActions.ok}
          key="ok"
        />,
      ]}
      {...confirmDialogProps}
    />
  </>
);

export default StatusDateDialogFormContainer(StatusDateDialogForm);
