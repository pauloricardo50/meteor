// @flow
import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import ErrorsField from 'uniforms-material/ErrorsField';

import CustomAutoFields from './CustomAutoFields';
import AutoFormDialogChildren from './AutoFormDialogChildren';

type AutoFormDialogContentProps = {
  description?: React.Node,
  emptyDialog?: Boolean,
  autoField?: React.Node,
  children?: React.Node,
  handleClose: Function,
  onSubmit: Function,
};

const AutoFormDialogContent = ({
  description,
  emptyDialog,
  autoField,
  children,
  handleClose,
  onSubmit,
}: AutoFormDialogContentProps) => (
  <DialogContent>
    {description && (
      <DialogContentText style={{ marginBottom: 32 }}>
        {description}
      </DialogContentText>
    )}
    {!emptyDialog && <CustomAutoFields autoField={autoField} automaticFocus />}
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
