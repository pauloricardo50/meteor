// @flow
import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '../Button';
import T from '../Translation';

type DialogComponentsProps = {};

const makeRenderDialogPart = dialogProps => (part) => {
  if (typeof part === 'function') {
    return part(dialogProps);
  }

  return part;
};

const defaultActions = ({ closeModal }) => (
  <Button className="dialog-close" primary onClick={closeModal}>
    <T id="general.close" />
  </Button>
);

const DialogComponents = ({
  closeModal,
  title,
  description,
  content,
  actions = defaultActions,
  returnValue,
}: DialogComponentsProps) => {
  const renderDialogPart = makeRenderDialogPart({ closeModal, returnValue });

  return (
    <>
      {title && <DialogTitle>{renderDialogPart(title)}</DialogTitle>}
      <DialogContent>
        {description && (
          <DialogContentText>{renderDialogPart(description)}</DialogContentText>
        )}
        {renderDialogPart(content)}
      </DialogContent>
      <DialogActions>{renderDialogPart(actions)}</DialogActions>
    </>
  );
};

export default DialogComponents;
