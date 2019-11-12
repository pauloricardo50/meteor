import React from 'react';
import PropTypes from 'prop-types';

import MuiTableBody from '@material-ui/core/TableBody';

import Row from './Row';
import SelectableRow from './SelectableRow';

const TableBody = ({
  data,
  selectable,
  columnOptions,
  page,
  rowsPerPage,
  clickable,
}) => (
  <MuiTableBody>
    {data
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row, i) =>
        selectable ? (
          <SelectableRow
            key={row.id || i}
            row={row}
            columnOptions={columnOptions}
            isSelected={this.isSelected(row.id)}
            onSelect={this.handleSelect}
          />
        ) : (
          <Row
            key={row.id || i}
            row={row}
            columnOptions={columnOptions}
            clickable={clickable}
          />
        ),
      )}
  </MuiTableBody>
);

TableBody.propTypes = {
  clickable: PropTypes.bool,
  columnOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  selectable: PropTypes.bool,
};

TableBody.defaultProps = {
  selectable: false,
  clickable: false,
};

export default TableBody;
