import React from 'react';

const TableOptions = ({ allColumns }) => {
  if (!allColumns) {
    return null;
  }

  // TODO: Implement this, ideally with the outcome of this:
  // https://github.com/mui-org/material-ui/issues/21022
  // we'd like to have an IconButton that opens a Select where you can choose which columns to display
  return null;
};

export default TableOptions;
