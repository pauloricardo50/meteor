import React from 'react';
import { withProps } from 'recompose';

import T from 'core/components/Translation';

const columnOptions = [
  { id: 'name', label: <T id="Forms.name" /> },
  { id: 'email', label: <T id="Forms.email" /> },
  { id: 'phoneNumber', label: <T id="Forms.phoneNumber" /> },
  { id: 'title', label: <T id="Forms.title" /> },
  { id: 'ref', label: <T id="Forms.refId" /> },
];

const mapUser = ({
  _id: userId,
  name,
  email,
  phoneNumber,
  $metadata: { title },
}) => ({
  id: userId,
  columns: [name, email, phoneNumber, title, userId],
});

export default withProps(({ users }) => ({
  rows: users.map(mapUser),
  columnOptions,
}));
