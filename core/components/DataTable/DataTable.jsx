import React, { useCallback, useMemo, useState } from 'react';
import Backdrop from '@material-ui/core/Backdrop';

import usePaginatedMeteorData from '../../hooks/usePaginatedMeteorData';
import Loading from '../Loading';
import Table from './Table';
import { paginationOptions } from './Table/TableFooter';

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
  initialPageSize = paginationOptions[1],
  columns,
  initialSort,
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

  const onStateChange = useCallback(({ pageIndex, pageSize, sortBy }) => {
    const [{ desc, id } = {}] = sortBy;
    setDataTableState({
      pageIndex,
      pageSize,
      sort: id,
      sortDirection: desc ? 1 : -1,
    });
  }, []);

  return (
    <div className="data-table" data-testid="data-table">
      <div className="table-container">
        <Table
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
          {...rest}
        />
        <Backdrop
          open={loading}
          className="data-table-backdrop"
          transitionDuration={1000}
        >
          <Loading />
        </Backdrop>
      </div>
    </div>
  );
};

export default DataTable;
