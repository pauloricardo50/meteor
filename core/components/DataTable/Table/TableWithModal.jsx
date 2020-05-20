import React, { useCallback, useMemo, useReducer } from 'react';

import { AutoFormDialog } from '../../AutoForm2/AutoFormDialog';
import Button from '../../Button';
import Dialog from '../../Material/Dialog';
import T from '../../Translation';
import Table from './Table';

const getModal = ({ modalType, modalProps, open, handleClose, row }) => {
  if (modalType === 'form') {
    return <AutoFormDialog {...modalProps} open={open} setOpen={handleClose} />;
  }

  if (modalType === 'dialog') {
    return (
      <Dialog
        actions={
          <Button onClick={handleClose}>
            <T id="general.close" />
          </Button>
        }
        {...modalProps}
        row={row}
        open={open}
        onClose={handleClose}
      />
    );
  }

  throw new Error(
    'Invalid modalType in TableWithModal. use either "form" or "dialog"',
  );
};

const modalReducer = (state, action) => {
  if (action.type === 'open') {
    return { ...state, open: true, row: action.payload };
  }
  if (action.type === 'close') {
    return { ...state, open: false, row: null };
  }

  return state;
};
const initialState = { open: false, row: null };

const TableWithModal = ({ getModalProps, modalType, hooks = [], ...rest }) => {
  const [{ open, row }, dispatch] = useReducer(modalReducer, initialState);
  const handleClose = useCallback(() => dispatch({ type: 'close' }), []);
  const handleOpen = useCallback(
    payload => dispatch({ type: 'open', payload }),
    [],
  );

  if (!getModalProps) {
    return <Table hooks={hooks} {...rest} />;
  }

  const modalProps = useMemo(() => getModalProps(row), [row]);

  return (
    <>
      {getModal({
        modalType,
        getModalProps,
        handleClose,
        open,
        modalProps,
      })}
      <Table
        {...rest}
        hooks={[
          ...hooks,
          h =>
            h.getRowProps.push((rowProps, { row: onClickRow }) => ({
              ...rowProps,
              onClick: () => handleOpen(onClickRow),
            })),
        ]}
      />
    </>
  );
};

export default TableWithModal;
