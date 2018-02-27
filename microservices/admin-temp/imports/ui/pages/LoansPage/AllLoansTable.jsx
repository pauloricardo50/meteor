import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Table from 'core/components/Table';
import moment from 'moment';

import { IntlNumber } from 'core/components/Translation';

const columnOptions = [
  {
    id: '#',
    // style: { width: 32, textAlign: 'left' },
  },
  {
    id: 'Nom',
    // style: { width: 40, textAlign: 'left' },
  },
  {
    id: 'Créé le',
    // style: { width: 40, textAlign: 'left' },
  },
  {
    id: 'Updaté le',
    // style: { width: 40, textAlign: 'left' },
  },
  {
    id: 'Étape',
    // style: { width: 40, textAlign: 'left' },
    numeric: true,
  },
  {
    id: 'Valeur du bien',
    // style: { width: 40, textAlign: 'left' },
    format: value => <IntlNumber value={value} format="money" />,
    numeric: true,
  },
  {
    id: 'Fortune totale',
    // style: { width: 40, textAlign: 'left' },
    format: value => <IntlNumber value={value} format="money" />,
    numeric: true,
  },
  {
    id: 'Qualité',
    // style: { width: 40, textAlign: 'left' },
  },
];

export default class AllLoansTable extends Component {
  constructor(props) {
    super(props);

    this.setupRows();
  }

  setupRows = () => {
    const { loans, properties, history } = this.props;
    this.rows = loans.map((loan, index) => ({
      id: loan._id,
      columns: [
        index + 1,
        loan.name,
        moment(loan.createdAt).format('D MMM YY à HH:mm:ss'),
        moment(loan.updatedAt).format('D MMM YY à HH:mm:ss'),
        loan.logic.step + 1,
        loan.property ? loan.property.value : 'N/A',
        loan.general.fortuneUsed + (loan.general.insuranceFortuneUsed || 0),
        'Très Bon',
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
  loans: PropTypes.arrayOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
