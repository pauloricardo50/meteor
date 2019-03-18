import React from 'react';
import { compose, withProps } from 'recompose';
import moment from 'moment';

import T from 'core/components/Translation';
import { withSmartQuery } from 'core/api';
import referredUsers from 'core/api/users/queries/referredUsers';

const columnOptions = [
  { id: 'name' },
  { id: 'email' },
  { id: 'phoneNumber' },
  { id: 'createdAt' },
].map(({ id }) => ({ id, label: <T id={`Forms.${id}`} /> }));

const mapUser = ({ _id, name, email, phoneNumber, createdAt }) => ({
  id: _id,
  columns: [
    name,
    email,
    phoneNumber,
    {
      raw: createdAt.getTime(),
      label: moment(createdAt).format('D MMM YY à HH:mm'),
    },
  ],
});

export default compose(
  withSmartQuery({
    query: referredUsers,
    params: ({ _id: organisationId }) => ({ organisationId }),
    queryOptions: { reactive: false },
    dataName: 'customers',
  }),
  withProps(({ customers }) => ({
    rows: customers.map(mapUser),
    columnOptions,
  })),
);
