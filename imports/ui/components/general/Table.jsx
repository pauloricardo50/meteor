import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Table as MuiTable,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import { T } from '/imports/ui/components/general/Translation.jsx';

export default class Table extends Component {
  render() {
    const {
      columns,
      rows,
      height,
      selectable,
      multiSelectable,
      selectAll,
      onRowSelection,
      selected,
    } = this.props;

    // Make sure columns and rows are the same length
    if (rows.length && columns.length !== rows[0].columns.length) {
      throw Error();
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
              {columns.map((column, i) =>
                <TableHeaderColumn key={i} style={{ ...column.style, textAlign: column.align }}>
                  {column.id && <T id={column.id} values={column.intlValues} />}
                </TableHeaderColumn>,
              )}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={selectable} deselectOnClickaway showRowHover stripedRows>
            {rows.map(row =>
              <TableRow key={row.id} selected={row.id === selected}>
                {row.columns.map((column, i) =>
                  <TableRowColumn
                    key={i}
                    style={{ ...columns[i].style, textAlign: columns[i].align, fontWeight: 400 }}
                  >
                    {typeof columns[i].format === 'function' ? columns[i].format(column) : column}
                  </TableRowColumn>,
                )}
              </TableRow>,
            )}
          </TableBody>
        </MuiTable>
      </div>
    );
  }
}

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
