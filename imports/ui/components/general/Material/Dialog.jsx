import React from 'react';
import PropTypes from 'prop-types';

import MuiDialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const Dialog = (props) => {
  const { title, actions, children, important, text, ...otherProps } = props;
  return (
    <MuiDialog
      ignoreBackdropClick={important}
      ignoreEscapeKeyUp={important}
      // withResponsiveFullScreen
      {...otherProps}
    >
      <DialogTitle>{title}</DialogTitle>
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
  actions: PropTypes.array,
  children: PropTypes.node,
};

Dialog.defaultProps = {
  important: false,
  title: undefined,
  actions: undefined,
  children: undefined,
};

export default Dialog;
