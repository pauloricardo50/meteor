import React from 'react';
import PropTypes from 'prop-types';

import { TableCell, TableRow } from 'material-ui/Table';

const styles = {
  cell: { textAlign: 'left' },
};

const Row = ({ row, columnOptions, clickable }) => (
  <TableRow hover={clickable} onClick={row.handleClick || null}>
    {row.columns.map((column, j) => (
      <TableCell
        key={j}
        style={columnOptions[j].style || styles.cell}
        numeric={columnOptions[j].numeric}
        padding={columnOptions[j].padding || 'dense'}
      >
        {columnOptions[j].format ? columnOptions[j].format(column) : column}
      </TableCell>
    ))}
  </TableRow>
);

Row.propTypes = {
  row: PropTypes.objectOf(PropTypes.any).isRequired,
  columnOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Row;
