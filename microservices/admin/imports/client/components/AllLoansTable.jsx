import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { LOANS_COLLECTION, USERS_COLLECTION } from 'core/api/constants';
import Table, { ORDER } from 'core/components/Table';
import T, { IntlNumber } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';
import Calculator from 'core/utils/Calculator';

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
    this.rows = loans.map((loan) => {
      const {
        _id: loanId,
        name,
        user,
        status,
        createdAt,
        updatedAt,
        structure,
        step,
        anonymous,
      } = loan;

      return {
        id: loanId,
        columns: [
          name,
          {
            raw: user && user.name,
            label: anonymous ? (
              'Anonyme'
            ) : (
              <CollectionIconLink
                relatedDoc={{ ...user, collection: USERS_COLLECTION }}
                key="user"
              />
            ),
          },
          {
            raw: status,
            label: (
              <StatusLabel
                status={status}
                key="status"
                collection={LOANS_COLLECTION}
              />
            ),
          },
          {
            raw: createdAt && createdAt.getTime(),
            label: moment(createdAt).fromNow(),
          },
          {
            raw: updatedAt && updatedAt.getTime(),
            label: updatedAt ? moment(updatedAt).fromNow() : '-',
          },
          {
            raw: step,
            label: <T id={`Forms.step.${step}`} key="step" />,
          },
          Calculator.selectPropertyValue({ loan }),
          Calculator.selectLoanValue({ loan }),
        ],
        handleClick: () => history.push(`/loans/${loanId}`),
      };
    });
  };

  render() {
    return (
      <Table
        columnOptions={columnOptions}
        rows={this.rows}
        noIntl
        clickable
        initialOrder={ORDER.DESC}
      />
    );
  }
}

AllLoansTable.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  loans: PropTypes.arrayOf(PropTypes.any).isRequired,
};
