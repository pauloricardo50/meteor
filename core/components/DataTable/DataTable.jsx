import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';

import Loading from '../Loading';
import Table from './Table';

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

const DataTable = ({ columns, data }) => {
  const isLoading = false;

  return (
    <div className="data-table">
      <div className="table-container">
        <Table
          columns={columns}
          data={data}
          tableOptions={{
            manualSortBy: true, // Sorting is done server-side
            disableMultiSort: true, // No multiple sorting on the server for now
            disableSortRemove: true,
            manualPagination: true,
            pageCount: 10, // TODO: set this
          }}
        />
        <Backdrop open={isLoading} className="data-table-backdrop">
          <Loading />
        </Backdrop>
      </div>
    </div>
  );
};
export default DataTable;
