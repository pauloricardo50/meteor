import React, { useMemo, useState } from 'react';

import { AutoFormDialog } from '../AutoForm2/AutoFormDialog';
import Button from '../Button';
import Dialog from '../Material/Dialog';
import T from '../Translation';
import Table from '.';

const getModal = ({
  modalType,
  modalProps,
  getModalProps,
  open,
  setOpen,
  activeRow,
  ModalComponent,
}) => {
  const props = activeRow ? getModalProps({ row: activeRow, setOpen }) : {};

  if (ModalComponent) {
    return <ModalComponent {...props} open={open} setOpen={setOpen} />;
  }

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
        actions={
          <Button onClick={() => setOpen(false)}>
            <T id="general.close" />
          </Button>
        }
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
  ModalComponent,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const [activeRowId, setActiveRowId] = useState(null);
  const mappedRows = useMemo(
    () =>
      rows.map(row => ({
        ...row,
        handleClick: event => {
          if (row.handleClick) {
            row.handleClick();
          }

          // Prevent modal to open when event propagation has been stopped
          if (!event.isPropagationStopped()) {
            setOpen(true);
            setActiveRowId(row.id);
          }
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
        ModalComponent,
      })}
      <Table {...rest} rows={mappedRows} />
    </>
  );
};

export default TableWithModal;
