import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

const getPaginationParams = ({ query, pageSize }) => {
  if (typeof query === 'string') {
    return {
      $options: { limit: pageSize, skip: 0 },
    };
  }

  return { $limit: pageSize, $skip: 0 };
};

const DataTable = ({
  queryConfig,
  queryDeps,
  initialPageSize = paginationOptions[1],
  columns,
}) => {
  const { data = [], loading, refetch } = useStaticMeteorData({
    ...queryConfig,
    params: {
      ...queryConfig.params,
      ...getPaginationParams({
        query: queryConfig.query,
        pageSize: initialPageSize,
      }),
    },
  });
  const {
    data: allRowsCount,
    loading: loadingCount,
    refetch: refetchCount,
  } = useStaticMeteorData({
    ...queryConfig,
    type: 'count',
    callback: data => {},
  });
  const [pageCount, setPageCount] = useState();

  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  const onStateChange = useCallback(({ pageSize }) => {
    refetch();
    refetchCount(({ params }, newCount) => {
      setPageCount(Math.ceil(newCount / pageSize));
    });
  });

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
            pageCount, // TODO: set this
          }}
          initialPageSize={initialPageSize}
          onStateChange={onStateChange}
          allRowsCount={allRowsCount}
        />
        <Backdrop
          open={loading || loadingCount}
          className="data-table-backdrop"
        >
          <Loading />
        </Backdrop>
      </div>
    </div>
  );
};

export default DataTable;
