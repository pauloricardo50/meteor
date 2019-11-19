import React from 'react';
import { mapProps } from 'recompose';
import moment from 'moment';

import { LOANS_COLLECTION, USERS_COLLECTION } from 'core/api/constants';
import T, { Money } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';
import Calculator from 'core/utils/Calculator';

const columnOptions = [
  { id: 'No.' },
  { id: 'Compte' },
  { id: 'Statut' },
  { id: 'Créé le' },
  { id: 'Modifié' },
  { id: 'Étape' },
  {
    id: 'Valeur du bien',
    format: value => <Money value={value} />,
    align: 'right',
  },
  {
    id: 'Hypothèque',
    format: value => (
      <b>
        <Money value={value} />
      </b>
    ),
    align: 'right',
  },
];

const getRows = ({ loans, history }) =>
  loans.map(loan => {
    const {
      _id: loanId,
      name,
      user,
      status,
      createdAt,
      updatedAt,
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

export default mapProps(props => ({
  columnOptions,
  rows: getRows(props),
}));
