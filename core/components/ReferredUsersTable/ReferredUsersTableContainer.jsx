import React from 'react';
import moment from 'moment';
import { compose, withProps, withState } from 'recompose';

import { withSmartQuery } from '../../api/containerToolkit';
import { proReferredByUsers } from '../../api/users/queries';
import T from '../Translation';

export const getReferredBy = (referredByUserId, organisationId) => {
  if (referredByUserId === true) {
    return;
  }

  if (referredByUserId === 'referral') {
    return 'referral';
  }

  if (organisationId === referredByUserId) {
    return 'nobody';
  }

  return referredByUserId;
};

const columnOptions = [
  { id: 'name' },
  { id: 'email' },
  { id: 'phoneNumber' },
  { id: 'createdAt' },
].map(({ id }) => ({ id, label: <T id={`Forms.${id}`} /> }));

const mapUser = user => {
  const { _id, name, email, phoneNumber, createdAt } = user;
  return {
    id: _id,
    user,
    columns: [
      name,
      email,
      phoneNumber,
      {
        raw: createdAt.getTime(),
        label: moment(createdAt).format('D MMM YY à HH:mm'),
      },
    ],
  };
};

export default compose(
  withState('referredByUserId', 'setReferredByUserId', true),
  withSmartQuery({
    query: proReferredByUsers,
    params: ({
      referredByUserId,
      organisationId,
      fixedOrganisationId,
      ownReferredUsers = true,
    }) => ({
      ownReferredUsers,
      referredByUserId: getReferredBy(referredByUserId, organisationId),
      organisationId: fixedOrganisationId,
      $body: {
        name: 1,
        email: 1,
        emails: 1,
        phoneNumber: 1,
        createdAt: 1,
      },
    }),
    queryOptions: { reactive: false },
    dataName: 'customers',
  }),
  withProps(({ customers }) => ({
    rows: customers.map(mapUser),
    columnOptions,
  })),
);
