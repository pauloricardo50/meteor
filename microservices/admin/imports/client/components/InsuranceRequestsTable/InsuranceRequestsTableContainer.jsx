import React from 'react';
import { withProps } from 'recompose';
import moment from 'moment';

import { USERS_COLLECTION } from 'core/api/constants';
import { CollectionIconLink } from 'core/components/IconLink';

const columnOptions = [
  { id: 'No.' },
  { id: 'Compte' },
  { id: 'Statut' },
  { id: 'Créé le' },
  { id: 'Modifié' },
];

const getRows = ({ insuranceRequests = [], history }) =>
  insuranceRequests.map(insuranceRequest => {
    const {
      _id: insuranceRequestId,
      name,
      user,
      status,
      createdAt,
      updatedAt,
    } = insuranceRequest;

    return {
      id: insuranceRequestId,
      columns: [
        name,
        {
          raw: user && user.name,
          label: user ? (
            <CollectionIconLink
              relatedDoc={{ ...user, collection: USERS_COLLECTION }}
              key="user"
            />
          ) : (
            'Pas de compte'
          ),
        },
        {
          raw: status,
          label: <span>{status}</span>,
        },
        {
          raw: createdAt && createdAt.getTime(),
          label: moment(createdAt).fromNow(),
        },
        {
          raw: updatedAt && updatedAt.getTime(),
          label: updatedAt ? moment(updatedAt).fromNow() : '-',
        },
      ],
      handleClick: () =>
        history.push(`/insuranceRequests/${insuranceRequestId}`),
    };
  });

export default withProps(props => ({
  columnOptions,
  rows: getRows(props),
}));
