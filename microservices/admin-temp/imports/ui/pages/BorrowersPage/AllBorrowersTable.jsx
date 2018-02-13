import PropTypes from 'prop-types';
import React, { Component } from 'react';

import moment from 'moment';
import Table from 'core/components/Table';
import { T } from '../../../core/components/Translation/';

const columnOptions = [
  { id: '#', style: { width: 32, textAlign: 'left' } },
  { id: <T id={`BorrowersTable.name`} />, style: { textAlign: 'left' } },
  { id: <T id={`BorrowersTable.createdAt`} />, style: { textAlign: 'left' } },
  { id: <T id={`BorrowersTable.updatedAt`} />, style: { textAlign: 'left' } },
];

export default class AllBorrowersTable extends Component {
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
        (borrower.firstName || '') + ' ' + (borrower.lastName || ''),
        moment(borrower.createdAt).format('D MMM YY à HH:mm:ss'),
        moment(borrower.updatedAt).format('D MMM YY à HH:mm:ss'),
      ],
      //handleClick: () => this.props.history.push(`/borrowers/${borrower._id}`),
    }));
    return this.rows;
  };

  render() {
    if (!this.props.isLoading) {
      return <Table columnOptions={columnOptions} rows={this.setupRows(this.props)} noIntl />;
    }
    else {
      return null;
    }
  }
}

AllBorrowersTable.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
