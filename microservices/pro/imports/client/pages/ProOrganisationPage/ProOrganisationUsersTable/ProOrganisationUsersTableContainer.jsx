import React from 'react';
import { withProps } from 'recompose';

import T from 'core/components/Translation';

const columnOptions = [
  { id: 'name', label: <T id="Forms.name" /> },
  { id: 'email', label: <T id="Forms.email" /> },
  { id: 'phoneNumber', label: <T id="Forms.phoneNumber" /> },
  { id: 'title', label: <T id="Forms.title" /> },
];

const mapUser = (user) => {
  const { _id: userId, name, email, phoneNumber, $metadata } = user;
  const title = $metadata.title;

  return {
    id: userId,
    columns: [name, email, phoneNumber, title],
  };
};

export default withProps(({ users }) => ({
  rows: users.map(mapUser),
  columnOptions,
}));
