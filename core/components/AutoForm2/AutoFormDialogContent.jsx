import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { ErrorsField } from 'uniforms-material';

import AutoFormDialogChildren from './AutoFormDialogChildren';
import AutoFormLayout from './AutoFormLayout';
import CustomAutoFields from './CustomAutoFields';

const AutoFormDialogContent = ({
  description,
  emptyDialog,
  autoField,
  children,
  handleClose,
  onSubmit,
  layout,
  schemaKeys,
}) => (
  <DialogContent>
    {description && (
      <DialogContentText style={{ marginBottom: 32 }}>
        {description}
      </DialogContentText>
    )}

    {!emptyDialog && !layout && (
      <CustomAutoFields autoField={autoField} automaticFocus />
    )}

    {!emptyDialog && layout && (
      <AutoFormLayout
        AutoField={autoField}
        layout={layout}
        schemaKeys={schemaKeys}
        automaticFocus
      />
    )}

    <ErrorsField />

    {children && (
      <AutoFormDialogChildren
        renderFunc={children}
        closeDialog={handleClose}
        onSubmit={onSubmit}
      />
    )}
  </DialogContent>
);

export default AutoFormDialogContent;
