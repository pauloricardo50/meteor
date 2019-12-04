// @flow
import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { ErrorsField } from 'uniforms-material';

import CustomAutoFields from './CustomAutoFields';
import AutoFormDialogChildren from './AutoFormDialogChildren';
import AutoFormLayout from './AutoFormLayout';

type AutoFormDialogContentProps = {
  autoField?: React.Node,
  children?: React.Node,
  description?: React.Node,
  emptyDialog?: Boolean,
  handleClose: Function,
  layout?: any,
  onSubmit: Function,
  schemaKeys: Array,
};

const AutoFormDialogContent = ({
  description,
  emptyDialog,
  autoField,
  children,
  handleClose,
  onSubmit,
  layout,
  schemaKeys,
}: AutoFormDialogContentProps) => (
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
