import React, { useState } from 'react';

import { AutoFormDialog } from '../AutoForm2/AutoFormDialog';
import Table from '../Table';

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
          onDelete={onDelete && (() => onDelete(model))}
        />
      )}
    </>
  );
};

export default TableModifier;
