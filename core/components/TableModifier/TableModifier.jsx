//
import React, { useState } from 'react';

import { AutoFormDialog } from '../AutoForm2/AutoFormDialog';
import Table from '../Table';
import Button from '../Button';
import T from '../Translation';

const TableModifier = ({
  rows,
  columnOptions,
  schema,
  onSubmit,
  onDelete,
  title,
  description,
  allow,
  ...props
}) => {
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState({});

  const mappedRows = rows.map(row => {
    if (!row.doc) {
      throw new Error(
        'Each row must have a "doc" property when using TableModifier',
      );
    }

    return {
      ...row,
      handleClick: () => {
        if (row.handleClick) {
          row.handleClick();
        }

        if (!allow || allow(row.doc)) {
          setModel(row.doc);
          setOpen(true);
        }
      },
    };
  });

  return (
    <>
      <Table rows={mappedRows} columnOptions={columnOptions} {...props} />
      {schema && (
        <AutoFormDialog
          title={title}
          description={description}
          schema={schema}
          open={open}
          setOpen={setOpen}
          model={model}
          onSubmit={onSubmit}
          renderAdditionalActions={({ setDisableActions, disabled }) =>
            onDelete && (
              <Button
                onClick={() => {
                  const confirm = window.confirm(
                    'Êtes vous sûr de vouloir supprimer?',
                  );

                  if (!confirm) {
                    return;
                  }

                  setDisableActions(true);
                  setDeleting(true);
                  return onDelete(model)
                    .then(() => setOpen(false))
                    .finally(() => {
                      setDeleting(false);
                      setDisableActions(true);
                    });
                }}
                error
                loading={deleting}
                disabled={disabled}
              >
                <T id="general.delete" />
              </Button>
            )
          }
        />
      )}
    </>
  );
};

export default TableModifier;
