import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Table from 'core/components/Table';
import T, { IntlNumber } from 'core/components/Translation';
import { LOANS_COLLECTION, USERS_COLLECTION } from 'core/api/constants';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';

const columnOptions = [
  { id: 'No.' },
  { id: 'Utilisateur' },
  { id: 'Statut' },
  { id: 'Créé le' },
  { id: 'Modifié' },
  { id: 'Étape' },
  {
    id: 'Valeur du bien',
    format: value => <IntlNumber value={value} format="money" />,
    align: 'right',
  },
  {
    id: 'Hypothèque',
    format: value => <IntlNumber value={value} format="money" />,
    align: 'right',
  },
];

export default class AllLoansTable extends Component {
  constructor(props) {
    super(props);

    this.setupRows();
  }

  setupRows = () => {
    const { loans, history } = this.props;
    this.rows = loans.map(({
      _id: loanId,
      name,
      user,
      status,
      createdAt,
      updatedAt,
      structure,
      logic,
    }) => ({
      id: loanId,
      columns: [
        name,
        <CollectionIconLink
          relatedDoc={{ ...user, collection: USERS_COLLECTION }}
          key="user"
        />,
        <StatusLabel
          status={status}
          key="status"
          collection={LOANS_COLLECTION}
        />,
        moment(createdAt).format('D.M.YY à H:mm'),
        moment(updatedAt).fromNow(),
        <T id={`Forms.steps.${logic.step}`} key="step" />,
        structure.property ? structure.property.value : 0,
        structure.wantedLoan,
      ],
      handleClick: () => history.push(`/loans/${loanId}`),
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
