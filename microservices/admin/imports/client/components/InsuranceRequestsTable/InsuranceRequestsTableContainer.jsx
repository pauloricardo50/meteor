import moment from 'moment';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { withProps } from 'recompose';

import { CollectionIconLink } from 'core/components/IconLink';
import StatusLabel from 'core/components/StatusLabel';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';

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
          raw: user?.name,
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
          label: (
            <StatusLabel
              status={status}
              collection={INSURANCE_REQUESTS_COLLECTION}
            />
          ),
        },
        {
          raw: createdAt?.getTime(),
          label: moment(createdAt).fromNow(),
        },
        {
          raw: updatedAt?.getTime(),
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
