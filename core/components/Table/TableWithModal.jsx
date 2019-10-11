// @flow
import React, { useState, useMemo } from 'react';

import { AutoFormDialog } from '../AutoForm2/AutoFormDialog';
import Dialog from '../Material/Dialog';
import Table from '.';

type TableWithModalProps = {};

const getModal = ({
  modalType,
  modalProps,
  getModalProps,
  open,
  setOpen,
  activeRow,
}) => {
  const props = activeRow ? getModalProps({ row: activeRow, setOpen }) : {};

  if (modalType === 'form') {
    return (
      <AutoFormDialog
        {...modalProps}
        {...props}
        open={open}
        setOpen={setOpen}
      />
    );
  }

  if (modalType === 'dialog') {
    return (
      <Dialog
        {...modalProps}
        {...props}
        open={open}
        onClose={() => setOpen(false)}
      />
    );
  }

  throw new Error('Invalid modalType in TableWithModal');
};

const TableWithModal = ({
  modalType,
  getModalProps,
  modalProps,
  rows,
  ...rest
}: TableWithModalProps) => {
  const [open, setOpen] = useState(false);
  const [activeRowId, setActiveRowId] = useState(null);
  const mappedRows = useMemo(
    () =>
      rows.map(row => ({
        ...row,
        handleClick: () => {
          if (row.handleClick) {
            row.handleClick();
          }

          setOpen(true);
          setActiveRowId(row.id);
        },
      })),
    [rows],
  );
  const activeRow = useMemo(() => rows.find(({ id }) => id === activeRowId), [
    rows,
    activeRowId,
  ]);

  return (
    <>
      {getModal({
        modalType,
        modalProps,
        getModalProps,
        open,
        setOpen,
        activeRow,
      })}
      <Table {...rest} rows={mappedRows} />
    </>
  );
};

export default TableWithModal;
