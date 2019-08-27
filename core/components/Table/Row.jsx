import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { shouldDisplayLabelAndData } from './tableHelpers';

const displayValue = (columnValue, columnOptions) => {
  let value = columnValue;
  if (shouldDisplayLabelAndData(columnValue)) {
    value = columnValue.label;
  }

  if (columnOptions.format) {
    return columnOptions.format(value);
  }

  return value;
};

const Row = ({
  row: { handleClick = null, columns, rowProps = {} },
  columnOptions,
  clickable,
}) => (
  <TableRow hover={clickable} onClick={handleClick} {...rowProps}>
    {columns.map((column, j) => (
      <TableCell
        key={j}
        style={columnOptions[j].style}
        align={columnOptions[j].align}
        padding={columnOptions[j].padding}
        className={`col-${columnOptions[j].id}`}
      >
        {displayValue(column, columnOptions[j])}
      </TableCell>
    ))}
  </TableRow>
);

Row.propTypes = {
  clickable: PropTypes.bool.isRequired,
  columnOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  row: PropTypes.shape({
    handleClick: PropTypes.func,
    columns: PropTypes.array.isRequired,
  }).isRequired,
};

export default Row;
