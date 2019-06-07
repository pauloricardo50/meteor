import React from 'react';
import { compose, withProps, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import T from 'core/components/Translation';
import { proReferredByUsers } from 'core/api/users/queries';
import { withSmartQuery } from 'core/api';

const columnOptions = [
  { id: 'firstName', label: <T id="Forms.firstName" /> },
  { id: 'lastName', label: <T id="Forms.lastName" /> },
  { id: 'email', label: <T id="Forms.email" /> },
  { id: 'phoneNumber', label: <T id="Forms.phoneNumber" /> },
  { id: 'createdAt', label: <T id="Forms.createdAt" /> },
];

const makeMapUser = history => (user) => {
  const {
    _id: userId,
    firstName,
    lastName,
    email,
    phoneNumber,
    createdAt,
  } = user;

  return {
    id: userId,
    columns: [
      firstName,
      lastName,
      email,
      phoneNumber,
      {
        raw: createdAt.getTime(),
        label: moment(createdAt).format('D MMM YY à HH:mm'),
      },
    ],
    handleClick: (event) => {
      history.push(`/users/${user._id}`);
    },
  };
};

export default compose(
  mapProps(({ _id }) => ({ organisationId: _id })),
  withSmartQuery({
    query: proReferredByUsers,
    params: ({ organisationId }) => ({ organisationId }),
    queryOptions: { reactive: false },
    dataName: 'users',
  }),
  withRouter,
  withProps(({ users, history }) => ({
    rows: users.map(makeMapUser(history)),
    columnOptions,
  })),
);
