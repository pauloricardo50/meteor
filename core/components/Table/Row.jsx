import React from 'react';
import PropTypes from 'prop-types';

import { TableCell, TableRow } from 'material-ui/Table';
import { shouldDisplayLabelAndData } from './tableHelpers';

const styles = {
  cell: { textAlign: 'left' },
};

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
  row: { handleClick = null, columns },
  columnOptions,
  clickable,
}) => (
  <TableRow hover={clickable} onClick={handleClick}>
    {columns.map((column, j) => (
      <TableCell
        key={j}
        style={columnOptions[j].style || styles.cell}
        numeric={columnOptions[j].numeric}
        padding={columnOptions[j].padding || 'dense'}
      >
        {displayValue(column, columnOptions[j])}
      </TableCell>
    ))}
  </TableRow>
);

Row.propTypes = {
  row: PropTypes.shape({
    handleClick: PropTypes.func,
    columns: PropTypes.array.isRequired,
  }).isRequired,
  columnOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  clickable: PropTypes.bool.isRequired,
};

export default Row;
