import React from 'react';

import ConfirmMethod from '../ConfirmMethod';
import T from '../Translation';

const enhanceOnDelete = ({ onDelete, handleClose, toggleDeleting }) => (
  ...args
) => {
  toggleDeleting(true);
  return onDelete(...args)
    .then(result => {
      handleClose();
      return result;
    })
    .finally(result => {
      toggleDeleting(false);
      return result;
    });
};

const AutoFormDialogDelete = ({
  disabled,
  handleClose,
  loading,
  onDelete,
  toggleDeleting,
  deleteKeyword,
}) => (
  <ConfirmMethod
    method={enhanceOnDelete({
      onDelete,
      handleClose,
      toggleDeleting,
    })}
    disabled={disabled}
    loading={loading}
    buttonProps={{
      error: true,
      outlined: true,
    }}
    label={<T id="general.remove" />}
    keyword={deleteKeyword}
  />
);

export default AutoFormDialogDelete;
