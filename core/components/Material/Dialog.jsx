import React from 'react';
import PropTypes from 'prop-types';

import MuiDialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const Dialog = (props) => {
  const { title, actions, children, important, text, ...otherProps } = props;
  return (
    <MuiDialog
      disableBackdropClick={important}
      disableEscapeKeyDown={important}
      {...otherProps}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        {text && <DialogContentText>{text}</DialogContentText>}
        {children}
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </MuiDialog>
  );
};

Dialog.propTypes = {
  // A dialog can only be closed using the buttons if this boolean is set
  important: PropTypes.bool,
  title: PropTypes.node,
  text: PropTypes.node,
  actions: PropTypes.array,
  children: PropTypes.node,
};

Dialog.defaultProps = {
  important: false,
  title: undefined,
  text: undefined,
  actions: undefined,
  children: undefined,
};

export default Dialog;
