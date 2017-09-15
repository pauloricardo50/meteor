import React from 'react';
import PropTypes from 'prop-types';

import MuiTable from 'material-ui/Table/Table';
import TableBody from 'material-ui/Table/TableBody';
import TableHeader from 'material-ui/Table/TableHeader';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';

import { T } from '/imports/ui/components/general/Translation';

const Table = (props) => {
  const {
    columns,
    rows,
    height,
    selectable,
    multiSelectable,
    selectAll,
    onRowSelection,
    selected,
  } = props;

  // Make sure columns and rows are the same length
  if (rows.length && columns.length !== rows[0].columns.length) {
    throw new Error('column length has to be correct in Table');
  }

  return (
    <div className="mui-table">
      <MuiTable
        height={height}
        selectable={selectable}
        multiSelectable={multiSelectable}
        onRowSelection={rowIndexes =>
          onRowSelection(multiSelectable ? rowIndexes : rowIndexes[0])}
      >
        <TableHeader
          adjustForCheckbox={selectable}
          enableSelectAll={selectable && selectAll}
          displaySelectAll={selectable && selectAll}
        >
          <TableRow>
            {columns.map((column, i) => (
              <TableHeaderColumn key={i} style={column.style}>
                {column.id && (
                  <T id={column.id} values={column.intlValues} list="table" />
                )}
                {column.name || ''}
              </TableHeaderColumn>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={selectable}
          deselectOnClickaway={false}
          showRowHover
          stripedRows
        >
          {rows.map((row, i) => (
            <TableRow
              key={row.id || i}
              selected={row.id === selected}
              // https://github.com/callemall/material-ui/issues/1783
              onMouseDown={row.handleClick || null}
            >
              {row.columns.map((column, j) => (
                <TableRowColumn
                  key={j}
                  style={{ ...columns[j].style, fontWeight: 400 }}
                  // className={column.className}
                >
                  {typeof columns[j].format === 'function' ? (
                    columns[j].format(column)
                  ) : (
                    column
                  )}
                </TableRowColumn>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  height: PropTypes.string,
  selectable: PropTypes.bool,
  multiSelectable: PropTypes.bool,
  selectAll: PropTypes.bool,
  onRowSelection: PropTypes.func,
  selected: PropTypes.string,
};

Table.defaultProps = {
  height: '400px',
  selectable: false,
  multiSelectable: false,
  selectAll: false,
  onRowSelection: () => {},
  selected: undefined,
};

export default Table;
