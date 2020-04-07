import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';

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
        align={columnOptions[j].align}
        padding={columnOptions[j].padding}
      >
        {/* if the format function is provided, format the column, otherwise
          simply return the data */}
        {columnOptions[j].format ? columnOptions[j].format(column) : column}
      </TableCell>
    ))}
  </TableRow>
);

SelectableRow.propTypes = {
  columnOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  row: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SelectableRow;
