import PropTypes from 'prop-types';
import React, { Component } from 'react';

import moment from 'moment';
import Table from 'core/components/Table';
import { T } from 'core/components/Translation/';

const columnOptions = [
  { id: '#', style: { width: 32, textAlign: 'left' } },
  { id: <T id="BorrowersTable.name" /> },
  { id: <T id="BorrowersTable.createdAt" /> },
  { id: <T id="BorrowersTable.updatedAt" /> },
];

export default class BorrowersTable extends Component {
  constructor(props) {
    super(props);

    this.setupRows();
  }

  setupRows = () => {
    const borrowers = this.props.data;

    this.rows = borrowers.map((borrower, index) => ({
      id: borrower._id,
      columns: [
        index + 1,
        `${borrower.firstName} ${borrower.lastName}`,
        moment(borrower.createdAt).format('D MMM YY à HH:mm:ss'),
        moment(borrower.updatedAt).format('D MMM YY à HH:mm:ss'),
      ],
      handleClick: () => this.props.history.push(`/borrowers/${borrower._id}`),
    }));
    return this.rows;
  };

  render() {
    const { isLoading } = this.props;
    if (isLoading) {
      return null;
    }
    return (
      <Table
        columnOptions={columnOptions}
        rows={this.setupRows(this.props)}
        noIntl
        className="borrowers-table"
      />
    );
  }
}

BorrowersTable.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
