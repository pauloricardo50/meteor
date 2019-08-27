import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import T from '../Translation';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableFooter from './TableFooter';
import { ORDER, sortData } from './tableHelpers';
import TableCustom from './TableCustom';

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: [],
      order: props.initialOrder,
      orderBy: props.initialOrderBy,
      rowsPerPage: 25,
      page: 0,
    };
  }

  componentDidMount() {
    this.handleNewData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.state;
    const currentLength = data.length;
    const nextLength = nextProps.rows.length;
    // Lazy check to see if data has different length
    // FIXME should also check if all the data is the same, careful with sorting
    if (nextLength !== currentLength) {
      this.handleNewData(nextProps);
    } else if (data && nextProps.rows) {
      let differentProps = false;
      nextProps.rows.every((row) => {
        if (!data.includes(row)) {
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
    const { orderBy } = this.state;
    // Make sure columns and rows are the same length
    if (rows.length && columnOptions.length !== rows[0].columns.length) {
      throw new Error('column length has to be correct in Table');
    }

    this.setState({ data: rows }, () => this.handleSort(orderBy, false));
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
    const { onRowSelect } = this.props;
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
      onRowSelect(this.state.selected));
  };

  handleSelectAllClick = (event, checked) => {
    const { data } = this.state;
    if (checked) {
      this.setState({ selected: data.map(n => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleChangePage = (_, page) => this.setState({ page });

  handleChangeRowsPerPage = event =>
    this.setState({ rowsPerPage: event.target.value });

  isSelected = (id) => {
    const { selected, multiSelectable } = this.props;
    if (multiSelectable) {
      return this.state.selected.indexOf(id) !== -1;
    }

    return selected === id;
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
        <TableCustom>
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
        </TableCustom>
        {data.length === 0 && (
          <h3
            className="secondary flex center"
            style={{ width: '100%', padding: 16, boxSizing: 'border-box' }}
          >
            <T id="Table.empty" />
          </h3>
        )}
      </div>
    );
  }
}

Table.propTypes = {
  className: PropTypes.string,
  clickable: PropTypes.bool,
  columnOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  initialOrder: PropTypes.string,
  initialOrderBy: PropTypes.number,
  multiSelectable: PropTypes.bool,
  noIntl: PropTypes.bool,
  onRowSelect: PropTypes.func,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectable: PropTypes.bool,
  selectAll: PropTypes.bool,
  selected: PropTypes.string, // sets rows to change color on hover
  sortable: PropTypes.bool,
  style: PropTypes.object,
};

Table.defaultProps = {
  className: '',
  clickable: true,
  initialOrderBy: 0,
  initialOrder: ORDER.ASC,
  multiSelectable: false,
  noIntl: false,
  onRowSelect: () => {},
  selectable: false,
  selectAll: false,
  selected: undefined,
  sortable: true,
  style: {},
};
