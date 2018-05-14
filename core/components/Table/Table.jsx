import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MuiTable from 'material-ui/Table';
import classnames from 'classnames';

import { T } from 'core/components/Translation';

import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableFooter from './TableFooter';
import { ORDER, sortData } from './tableHelpers';

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: [],
      order: ORDER.ASC,
      orderBy: 0,
      rowsPerPage: 40,
      page: 0,
    };
  }

  componentDidMount() {
    this.handleNewData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const currentLength = this.state.data.length;
    const nextLength = nextProps.rows.length;
    // Lazy check to see if data has different length
    // FIXME should also check if all the data is the same, careful with sorting
    if (nextLength !== currentLength) {
      this.handleNewData(nextProps);
    } else if (this.state.data && nextProps.rows) {
      let differentProps = false;
      nextProps.rows.every((row) => {
        if (!this.state.data.includes(row)) {
          differentProps = true;
        }
      });

      if (differentProps) {
        this.handleNewData(nextProps);
      }
    }

    // If pagination is currently going on, make sure it is still needed
    if (currentLength > 10 && nextLength <= 10) {
      this.setState({ page: 0 });
    }
  }

  handleNewData = (props) => {
    const { rows, columnOptions } = props;
    // Make sure columns and rows are the same length
    if (rows.length && columnOptions.length !== rows[0].columns.length) {
      throw new Error('column length has to be correct in Table');
    }

    this.setState({ data: rows }, () =>
      this.handleSort(this.state.orderBy, false));
  };

  handleSort = (newOrderBy, changeOrder) => {
    const { data, orderBy, order } = this.state;
    this.setState(sortData({
      data,
      orderBy,
      order,
      newOrderBy,
      changeOrder,
    }));
  };

  handleSelect = (rowId) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(rowId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, rowId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected }, () =>
      this.props.onRowSelect(this.state.selected));
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleChangePage = (_, page) => this.setState({ page });

  handleChangeRowsPerPage = event =>
    this.setState({ rowsPerPage: event.target.value });

  isSelected = (id) => {
    if (this.props.multiSelectable) {
      return this.state.selected.indexOf(id) !== -1;
    }

    return this.props.selected === id;
  };

  render() {
    const {
      columnOptions,
      selectable,
      sortable,
      selectAll,
      style,
      noIntl,
      clickable,
      className,
    } = this.props;
    const { data, rowsPerPage, page, selected, order, orderBy } = this.state;
    const rowCount = data.length;

    return (
      <div className={classnames('mui-table', className)} style={style}>
        <MuiTable>
          <TableHeader
            columnOptions={columnOptions}
            sortable={sortable}
            onSelectAll={this.handleSelectAll}
            onSort={this.handleSort}
            selectAll={selectAll}
            numSelected={selected ? selected.length : 0}
            rowCount={rowCount}
            noIntl={noIntl}
            order={order}
            orderBy={orderBy}
          />
          <TableBody
            data={data}
            selectalbe={selectable}
            columnOptions={columnOptions}
            page={page}
            rowsPerPage={rowsPerPage}
            clickable={clickable}
          />
          {rowCount > rowsPerPage && (
            <TableFooter
              rowCount={rowCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          )}
        </MuiTable>
        {data.length === 0 && (
          <h3
            className="secondary flex center"
            style={{ width: '100%', padding: 32 }}
          >
            <T id="Table.empty" />
          </h3>
        )}
      </div>
    );
  }
}

Table.propTypes = {
  columnOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectable: PropTypes.bool,
  multiSelectable: PropTypes.bool,
  selectAll: PropTypes.bool,
  onRowSelect: PropTypes.func,
  selected: PropTypes.string,
  sortable: PropTypes.bool,
  style: PropTypes.object,
  noIntl: PropTypes.bool,
  clickable: PropTypes.bool, // sets rows to change color on hover
  className: PropTypes.string,
};

Table.defaultProps = {
  selectable: false,
  multiSelectable: false,
  selectAll: false,
  onRowSelect: () => {},
  selected: undefined,
  sortable: true,
  style: {},
  noIntl: false,
  clickable: true,
  className: '',
};
