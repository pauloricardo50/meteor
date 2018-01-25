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

export default class AllRequestsTable extends Component {
  constructor(props) {
    super(props);

    this.setupRows();
  }

  setupRows = () => {
    const { loanRequests, properties, history } = this.props;
    this.rows = loanRequests.map((request, index) => {
      const propertyValue = properties.find(property => property._id === request.property).value;
      return {
        id: request._id,
        columns: [
          index + 1,
          request.name,
          moment(request.createdAt).format('D MMM YY à HH:mm:ss'),
          moment(request.updatedAt).format('D MMM YY à HH:mm:ss'),
          request.logic.step + 1,
          propertyValue,
          request.general.fortuneUsed +
            (request.general.insuranceFortuneUsed || 0),
          'Très Bon',
        ],
        handleClick: () => history.push(`/requests/${request._id}`),
      };
    });
  };

  render() {
    return (
      <Table columnOptions={columnOptions} rows={this.rows} noIntl clickable />
    );
  }
}

AllRequestsTable.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
