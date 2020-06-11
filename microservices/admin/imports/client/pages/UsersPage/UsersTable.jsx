import React from 'react';

import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import DataTable from 'core/components/DataTable';
import { CollectionIconLink } from 'core/components/IconLink';
import Link from 'core/components/Link';
import T, { IntlDate } from 'core/components/Translation';

const UsersTable = () => (
  <DataTable
    queryConfig={{
      query: USERS_COLLECTION,
      params: {
        emails: 1,
        firstName: 1,
        lastName: 1,
        createdAt: 1,
        roles: 1,
        assignedEmployeeCache: 1,
      },
    }}
    initialSort={{ id: 'createdAt' }}
    columns={[
      {
        Header: 'Nom',
        accessor: 'lastName',
        Cell: ({
          row: {
            original: { firstName, lastName },
          },
        }) => [firstName, lastName].filter(name => name).join(' '),
      },
      { Header: 'Email', accessor: 'emails.0.address' },
      {
        Header: 'Créé',
        accessor: 'createdAt',
        Cell: ({ value }) => <IntlDate value={value} type="relative" />,
      },
      {
        Header: 'Rôle',
        accessor: 'roles.0._id',
        Cell: ({ value }) => <T id={`roles.${value}`} />,
      },
      {
        Header: 'Conseiller',
        accessor: 'assignedEmployeeCache.firstName',
        Cell: ({ row: { original } }) => {
          if (!original.assignedEmployeeCache?._id) {
            return null;
          }

          return (
            <CollectionIconLink
              relatedDoc={{
                ...original.assignedEmployeeCache,
                roles: [{ _id: ROLES.ADMIN }], // To display the picture
                _collection: USERS_COLLECTION,
              }}
            />
          );
        },
      },
    ]}
    addRowProps={({ original }) => ({
      component: Link,
      to: `/users/${original._id}`,
    })}
  />
);

export default UsersTable;
