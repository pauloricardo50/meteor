import React from 'react';

import MuiDialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const Dialog = (props) => {
  const { title, actions, children } = props;
  return (
    <MuiDialog {...props}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </MuiDialog>
  );
};

Dialog.propTypes = {};

export default Dialog;
