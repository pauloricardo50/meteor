import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Table from 'core/components/Table';
import { IntlNumber } from 'core/components/Translation';

const columnOptions = [
  { id: 'No.' },
  { id: 'Créé le' },
  { id: 'Updaté le' },
  { id: 'Étape', numeric: true },
  {
    id: 'Valeur du bien',
    format: value => <IntlNumber value={value} format="money" />,
    numeric: true,
  },
  {
    id: 'Hypothèque',
    format: value => <IntlNumber value={value} format="money" />,
    numeric: true,
  },
];

export default class AllLoansTable extends Component {
  constructor(props) {
    super(props);

    this.setupRows();
  }

  setupRows = () => {
    const { loans, history } = this.props;
    this.rows = loans.map((loan, index) => ({
      id: loan._id,
      columns: [
        loan.name,
        moment(loan.createdAt).format('D MMM YY à HH:mm:ss'),
        moment(loan.updatedAt).format('D MMM YY à HH:mm:ss'),
        loan.logic.step + 1,
        loan.structure.property ? loan.structure.property.value : 0,
        loan.structure.wantedLoan,
      ],
      handleClick: () => history.push(`/loans/${loan._id}`),
    }));
  };

  render() {
    return (
      <Table columnOptions={columnOptions} rows={this.rows} noIntl clickable />
    );
  }
}

AllLoansTable.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  loans: PropTypes.arrayOf(PropTypes.any).isRequired,
};
