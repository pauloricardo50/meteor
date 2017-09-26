import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Table from '/imports/ui/components/general/Table';
import moment from 'moment';

import { IntlNumber } from '/imports/ui/components/general/Translation';

const columns = [
  { name: '#', style: { width: 32, textAlign: 'left' } },
  { name: 'Nom', style: { width: 40, textAlign: 'left' } },
  { name: 'Créé le', style: { width: 40, textAlign: 'left' } },
  { name: 'Updaté le', style: { width: 40, textAlign: 'left' } },
  { name: 'Étape', style: { width: 40, textAlign: 'left' } },
  {
    name: 'Valeur du bien',
    style: { width: 40, textAlign: 'left' },
    format: value => <IntlNumber value={value} format="money" />,
  },
  {
    name: 'Fortune totale',
    style: { width: 40, textAlign: 'left' },
    format: value => <IntlNumber value={value} format="money" />,
  },
  { name: 'Qualité', style: { width: 40, textAlign: 'left' } },
];

export default class AllRequestsTable extends Component {
  constructor(props) {
    super(props);

    this.setupRows();
  }

  setupRows = () => {
    this.rows = this.props.loanRequests.map((request, index) => ({
      id: request._id,
      columns: [
        index + 1,
        request.name,
        moment(request.createdAt).format('D MMM YY à HH:mm:ss'),
        moment(request.updatedAt).format('D MMM YY à HH:mm:ss'),
        request.logic.step + 1,
        request.property.value,
        request.general.fortuneUsed + request.general.insuranceFortuneUsed,
        'Très Bon',
      ],
      handleClick: () =>
        this.props.history.push(`/admin/requests/${request._id}`),
    }));
  };

  render() {
    return (
      <Table
        height="800px"
        selectable={false}
        columns={columns}
        rows={this.rows}
      />
    );
  }
}

AllRequestsTable.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
