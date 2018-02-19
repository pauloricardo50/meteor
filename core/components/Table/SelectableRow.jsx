import React from 'react';
import PropTypes from 'prop-types';

import { TableCell, TableRow } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';

const styles = {
  cell: { textAlign: 'left' },
};

const SelectableRow = ({ row, columnOptions, isSelected, onSelect }) => (
  <TableRow
    hover
    onClick={() => {
      row.handleClick();
      onSelect(row.id);
    }}
    role="checkbox"
    aria-checked={isSelected}
    tabIndex={-1}
    selected={isSelected}
  >
    <TableCell padding="checkbox">
      <Checkbox checked={isSelected} />
    </TableCell>
    {row.columns.map((column, j) => (
      <TableCell
        key={j}
        style={columnOptions[j].style || styles.cell}
        numeric={columnOptions[j].numeric}
        padding={columnOptions[j].padding || 'dense'}
      >
        {/* if the format function is provided, format the column, otherwise
          simply return the data */}
        {columnOptions[j].format ? columnOptions[j].format(column) : column}
      </TableCell>
    ))}
  </TableRow>
);

SelectableRow.propTypes = {
  row: PropTypes.objectOf(PropTypes.any).isRequired,
  columnOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default SelectableRow;
