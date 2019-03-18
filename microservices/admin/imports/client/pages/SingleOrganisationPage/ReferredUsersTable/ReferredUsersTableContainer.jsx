import React from 'react';
import { compose, withProps, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import T from 'core/components/Translation';
import referredUsers from 'core/api/users/queries/referredUsers';
import { withSmartQuery } from 'core/api';

const columnOptions = [
  { id: 'firstName', label: <T id="Forms.firstName" /> },
  { id: 'lastName', label: <T id="Forms.lastName" /> },
  { id: 'email', label: <T id="Forms.email" /> },
  { id: 'phoneNumber', label: <T id="Forms.phoneNumber" /> },
];

const makeMapUser = history => (user) => {
  const { _id: userId, firstName, lastName, email, phoneNumber } = user;

  return {
    id: userId,
    columns: [firstName, lastName, email, phoneNumber],
    handleClick: (event) => {
      history.push(`/users/${user._id}`);
    },
  };
};

export default compose(
  mapProps(({ _id }) => ({ organisationId: _id })),
  withSmartQuery({
    query: referredUsers,
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
