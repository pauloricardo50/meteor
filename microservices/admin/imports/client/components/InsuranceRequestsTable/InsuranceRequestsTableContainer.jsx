import React from 'react';
import { withProps } from 'recompose';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

import {
  USERS_COLLECTION,
  INSURANCE_REQUESTS_COLLECTION,
} from 'core/api/constants';
import { CollectionIconLink } from 'core/components/IconLink';

const columnOptions = [
  { id: 'Dossier' },
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
    console.log('history:', history);

    return {
      id: insuranceRequestId,
      columns: [
        {
          raw: name,
          label: (
            <CollectionIconLink
              relatedDoc={{
                ...insuranceRequest,
                collection: INSURANCE_REQUESTS_COLLECTION,
              }}
            />
          ),
        },
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

export default withProps(props => {
  const history = useHistory();
  return {
    columnOptions,
    rows: getRows({ ...props, history }),
  };
});
