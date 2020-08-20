import React, { useCallback, useMemo, useState } from 'react';

import usePaginatedMeteorData from '../../hooks/usePaginatedMeteorData';
import { paginationOptions } from './Table/TableFooter';
import TableWithModal from './Table/TableWithModal';

// Sample usage

// import { allUsers } from 'core/api/users/queries';
/* <DataTable
  queryConfig={{
    query: LOANS_COLLECTION,
    params: { name: 1, createdAt: 1, structureCache: 1, customName: 1 },
  }}
  columns={[
    { Header: 'Nom', accessor: 'name' },
    {
      Header: 'PH',
      accessor: 'structureCache.wantedLoan',
      align: 'right',
      Cell: ({ value }) => <Money value={value} />,
    },
    { Header: 'Titre plan financier', accessor: 'structureCache.name' },
    { Header: 'Nom', accessor: 'customName' },
  ]}
  initialPageSize={5}
  addRowProps={({ original }) => ({
    component: Link,
    to: `/loans/${original._id}`,
  })}
/>; */

const DataTable = ({
  queryConfig,
  queryDeps,
  initialPageSize = paginationOptions[0],
  columns,
  initialSort,
  onStateChangeCallback = () => null,
  ...rest
}) => {
  const [dataTableState, setDataTableState] = useState({
    pageSize: initialPageSize,
    sort: initialSort?.id,
    sortDirection: initialSort ? (initialSort.desc ? 1 : -1) : undefined,
  });
  const { data = [], totalCount, pageCount, loading } = usePaginatedMeteorData(
    { ...dataTableState, ...queryConfig },
    queryDeps,
  );

  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  const onStateChange = useCallback(state => {
    const { pageIndex, pageSize, sortBy } = state;
    const [{ desc, id } = {}] = sortBy;
    setDataTableState({
      pageIndex,
      pageSize,
      sort: id,
      sortDirection: desc ? 1 : -1,
    });
    onStateChangeCallback(state);
  }, []);

  return (
    <div className="data-table" data-testid="data-table">
      <div className="table-container">
        <TableWithModal
          columns={memoizedColumns}
          data={memoizedData}
          tableOptions={{
            disableMultiSort: true, // No multiple sorting on the server for now
            disableSortRemove: true,
            manualPagination: true, // Pagination is done server-side
            manualSortBy: true, // Sorting is done server-side
            pageCount,
          }}
          initialPageSize={initialPageSize}
          onStateChange={onStateChange}
          allRowsCount={totalCount}
          initialSort={initialSort}
          loading={loading}
          {...rest}
        />
      </div>
    </div>
  );
};

export default DataTable;
