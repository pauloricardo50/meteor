import React from 'react';
import { withProps } from 'recompose';

import T from 'core/components/Translation';

const columnOptions = [
  { id: 'firstName', label: <T id="Forms.firstName" /> },
  { id: 'lastName', label: <T id="Forms.lastName" /> },
  { id: 'email', label: <T id="Forms.email" /> },
  { id: 'phoneNumber', label: <T id="Forms.phoneNumber" /> },
];

const mapUser = (user) => {
  const { _id: userId, firstName, lastName, email, phoneNumber } = user;

  return {
    id: userId,
    columns: [
      { raw: firstName, label: firstName },
      { raw: lastName, label: lastName },
      { raw: email, label: email },
      { raw: phoneNumber, label: phoneNumber },
    ],
  };
};

export default withProps(({ users }) => ({
  rows: users.map(mapUser),
  columnOptions,
}));
