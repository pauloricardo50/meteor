import React, { useMemo } from 'react';
import MuiTable from '@material-ui/core/Table';
import { useTable } from 'react-table';

import TableBody from './TableBody';
import TableFooter, { paginationOptions } from './TableFooter';
import TableHead from './TableHead';
import { getTableHooks, useStateChangeCallback } from './tableHelpers';

// import { useTable } from 'react-table';

// Both "columns" and "data" props should be memoized arrays:
//
// const data = useMemo(() => [ ... ], deps);

const Table = ({
  allowHidingColumns,
  allRowsCount,
  className,
  columns,
  data,
  initialHiddenColumns = [],
  initialPageIndex = 0,
  initialPageSize = paginationOptions[1],
  initialSort,
  onStateChange,
  padding = 'default',
  selectable,
  size = 'small',
  sortable = true,
  stickyHeader,
  tableOptions,
}) => {
  const {
    allColumns,
    getTableBodyProps,
    getTableProps,
    gotoPage,
    headerGroups,
    page,
    pageCount,
    prepareRow,
    setPageSize,
    state,
    rows,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: initialSort ? [initialSort] : [],
        pageSize: initialPageSize,
        pageIndex: initialPageIndex,
        hiddenColumns: allowHidingColumns ? initialHiddenColumns : [],
      },
      useControlledState: s =>
        useMemo(() => {
          console.log('state:', s);
          return s;
        }, [s]),
      ...tableOptions,
    },
    ...getTableHooks({ sortable, selectable }),
  );

  const { pageIndex, pageSize, sortBy } = state;
  useStateChangeCallback(onStateChange, { pageIndex, pageSize, sortBy });

  return (
    <MuiTable
      {...getTableProps()}
      className={className}
      padding={padding}
      size={size}
      stickyHeader={stickyHeader}
    >
      <TableHead headerGroups={headerGroups} />
      <TableBody
        getTableBodyProps={getTableBodyProps}
        prepareRow={prepareRow}
        rows={page}
      />
      <TableFooter
        allColumns={allowHidingColumns && allColumns}
        gotoPage={gotoPage}
        pageCount={pageCount}
        pageIndex={state.pageIndex}
        pageSize={state.pageSize}
        rowCount={allRowsCount || rows.length}
        setPageSize={setPageSize}
      />
    </MuiTable>
  );
};

export default Table;
