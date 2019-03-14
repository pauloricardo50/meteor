import React from 'react';
import { withProps } from 'recompose';

import T from 'core/components/Translation';

const columnOptions = [
  { id: 'firstName', label: <T id="Forms.firstName" /> },
  { id: 'lastName', label: <T id="Forms.lastName" /> },
  { id: 'email', label: <T id="Forms.email" /> },
  { id: 'phoneNumber', label: <T id="Forms.phoneNumber" /> },
  { id: 'title', label: <T id="Forms.title" /> },
];

const mapUser = (user) => {
  const {
    _id: userId,
    firstName,
    lastName,
    email,
    phoneNumber,
    $metadata,
  } = user;
  const title = $metadata.role;

  return {
    id: userId,
    columns: [firstName, lastName, email, phoneNumber, title],
  };
};

export default withProps(({ users }) => ({
  rows: users.map(mapUser),
  columnOptions,
}));
