import React from 'react';
import PropTypes from 'prop-types';

import { TableBody as MuiTableBody } from 'material-ui/Table';

import Row from './Row';
import SelectableRow from './SelectableRow';

const TableBody = ({ data, selectable, columnOptions, page, rowsPerPage }) => (
  <MuiTableBody>
    {data
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map(
        (row, i) =>
          (selectable ? (
            <SelectableRow
              key={row.id || i}
              row={row}
              columnOptions={columnOptions}
              isSelected={this.isSelected(row.id)}
              onSelect={this.handleSelect}
            />
          ) : (
            <Row key={row.id || i} row={row} columnOptions={columnOptions} />
          )),
      )}
  </MuiTableBody>
);

TableBody.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columnOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  selectable: PropTypes.bool,
};

TableBody.defaultProps = {
  selectable: false,
};

export default TableBody;
