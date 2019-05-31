import React from 'react';
import { compose, withProps } from 'recompose';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { withSmartQuery } from 'core/api';
import query from 'core/api/borrowers/queries/adminBorrowers';
import { LOANS_COLLECTION, USERS_COLLECTION } from 'core/api/constants';
import { CollectionIconLink } from 'core/components/IconLink';
import { baseBorrower } from 'core/api/fragments';

const columnOptions = [
  { id: '#', style: { width: 32, textAlign: 'left' } },
  { id: 'Nom' },
  { id: 'Utilisateur' },
  { id: 'Dossiers' },
  { id: 'Créé le' },
  { id: 'Modifié le' },
];

const mapBorrower = ({ history }) => (
  { _id: borrowerId, name, createdAt, updatedAt, user = {}, loans = [] },
  index,
) => ({
  id: borrowerId,
  columns: [
    index + 1,
    name || 'Emprunteur sans nom',
    <CollectionIconLink
      relatedDoc={{ ...user, collection: USERS_COLLECTION }}
      key="user"
    />,
    loans.map(loan => (
      <CollectionIconLink
        relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
        key={loan._id}
      />
    )),
    {
      raw: createdAt && createdAt.getTime(),
      label: moment(createdAt).fromNow(),
    },
    {
      raw: updatedAt && updatedAt.getTime(),
      label: updatedAt ? moment(updatedAt).fromNow() : '-',
    },
  ],
  handleClick: () => history.push(`/borrowers/${borrowerId}`),
});

export default compose(
  withSmartQuery({
    query,
    params: {
      $body: {
        ...baseBorrower(),
        loans: { name: 1 },
        user: { name: 1 },
      },
    },
    queryOptions: { reactive: false },
    dataName: 'borrowers',
    renderMissingDoc: false,
  }),
  withRouter,
  withProps(({ borrowers, history }) => ({
    rows: borrowers.map(mapBorrower({ history })),
    columnOptions,
  })),
);
