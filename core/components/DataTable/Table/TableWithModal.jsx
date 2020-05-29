import React, { useCallback, useMemo, useReducer } from 'react';

import { AutoFormDialog } from '../../AutoForm2/AutoFormDialog';
import Button from '../../Button';
import Dialog from '../../Material/Dialog';
import T from '../../Translation';
import Table from './Table';

const getModal = ({ modalType, modalProps, open, handleClose }) => {
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
    return { ...state, open: true, rowId: action.payload };
  }

  if (action.type === 'rowRemoved') {
    return { ...state, open: false, rowId: null };
  }

  if (action.type === 'close') {
    // Don't set rowId to null/undefined here, or else the UI jumps before the modal can close
    return { ...state, open: false };
  }

  return state;
};
const initialState = { open: false, rowId: null };

const TableWithModal = ({ getModalProps, modalType, hooks = [], ...rest }) => {
  const [{ open, rowId }, dispatch] = useReducer(modalReducer, initialState);
  const handleClose = useCallback(() => dispatch({ type: 'close' }), []);
  const handleOpen = useCallback(
    payload => dispatch({ type: 'open', payload }),
    [],
  );

  if (!getModalProps) {
    return <Table hooks={hooks} {...rest} />;
  }

  const modalProps = useMemo(() => {
    if (!rowId) {
      return null;
    }

    const row = rest?.data.find(({ _id }) => _id === rowId);

    if (row) {
      return getModalProps(row);
    }

    dispatch({ type: 'rowRemoved' });

    return null;
  }, [rowId, rest?.data]);

  return (
    <>
      {getModal({
        modalType,
        handleClose,
        open,
        modalProps,
      })}
      <Table
        {...rest}
        hooks={[
          ...hooks,
          h => {
            h.getRowProps.push((rowProps, { row }) => ({
              ...rowProps,
              onClick: () => handleOpen(row?.original._id),
            }));
          },
        ]}
      />
    </>
  );
};

export default TableWithModal;
