import React from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { compose, withProps } from 'recompose';

import { adminBorrowers as query } from 'core/api/borrowers/queries';
import { withSmartQuery } from 'core/api/containerToolkit';
import { baseBorrower } from 'core/api/fragments';
import { CollectionIconLink } from 'core/components/IconLink';

const columnOptions = [
  { id: 'Nom', format: v => <b>{v}</b> },
  { id: 'Compte' },
  { id: 'Dossiers' },
  { id: 'Créé le' },
  { id: 'Modifié le' },
];

const mapBorrower = ({ history }) => ({
  _id: borrowerId,
  name,
  createdAt,
  updatedAt,
  user = {},
  loans = [],
}) => ({
  id: borrowerId,
  columns: [
    name || 'Emprunteur sans nom',
    <CollectionIconLink relatedDoc={user} key="user" />,
    loans.map(loan => <CollectionIconLink relatedDoc={loan} key={loan._id} />),
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
  withProps(({ borrowers }) => {
    const history = useHistory();

    return {
      rows: borrowers.map(mapBorrower({ history })),
      columnOptions,
    };
  }),
);
