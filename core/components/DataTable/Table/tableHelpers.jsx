import React from 'react';
import { usePagination, useRowSelect, useSortBy } from 'react-table';

import TableCheckbox from './TableCheckbox';

export const getTableHooks = ({ sortable, selectable }) => {
  const array = [];

  if (sortable) {
    array.push(useSortBy);
  }

  // This hook must be added after the sortBy hook
  array.push(usePagination);

  if (selectable) {
    array.push(useRowSelect);
    array.push(hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <TableCheckbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <TableCheckbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    });
  }

  return array;
};
