import React from 'react';

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

const DataTable = ({ props }) => {
  console.log('yo');
  return (
    <div>
      <div>Hello from DataTable</div>
    </div>
  );
};

export default DataTable;
