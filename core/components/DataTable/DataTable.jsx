import React, { useCallback, useMemo, useState } from 'react';
import Backdrop from '@material-ui/core/Backdrop';

import { useStaticMeteorData } from '../../hooks/useMeteorData';
import Loading from '../Loading';
import Table from './Table';
import { paginationOptions } from './Table/TableFooter';

// Sample usage

// import { allUsers } from 'core/api/users/queries';
// <DataTable
//   query={allUsers}
//   filters={figure_this_out_to_make_it_convenient}
//   queryParams={({ search, createdAt, status }) => ({
//     role: 'ADMIN',
//     search,
//     createdAt,
//     status,
//   })}
//   columns={[ ... ]}
//   rows={data => data.map( ... )}
//   onRowClick={() => doStuff()}
// />;

const DataTable = ({ initialPageSize = paginationOptions[1] }) => {
  const { data, loading, refetch } = useStaticMeteorData({});
  const [pageCount, setPageCount] = useState();

  const memoizedColumns = useMemo(() => [], []);
  const memoizedData = useMemo(() => [], []);

  const allRowsCount = 100;
  const onStateChange = useCallback(({ pageSize }) => {
    refetch();
  });

  return (
    <div className="data-table">
      <div className="table-container">
        <Table
          columns={memoizedColumns}
          data={memoizedData}
          tableOptions={{
            disableMultiSort: true, // No multiple sorting on the server for now
            disableSortRemove: true,
            manualPagination: true, // Pagination is done server-side
            manualSortBy: true, // Sorting is done server-side
            pageCount, // TODO: set this
          }}
          initialPageSize={initialPageSize}
          onStateChange={onStateChange}
          allRowsCount={allRowsCount}
        />
        <Backdrop open={loading} className="data-table-backdrop">
          <Loading />
        </Backdrop>
      </div>
    </div>
  );
};

export default DataTable;
