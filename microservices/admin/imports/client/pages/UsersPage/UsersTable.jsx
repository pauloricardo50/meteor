import React, { useState } from 'react';

import {
  ROLES,
  USERS_COLLECTION,
  USER_STATUS,
} from 'core/api/users/userConstants';
import DataTable from 'core/components/DataTable';
import { CollectionIconLink } from 'core/components/IconLink';
import Link from 'core/components/Link';
import MongoSelect from 'core/components/Select/MongoSelect';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';
import T, { IntlDate } from 'core/components/Translation';

import { useAdmins } from '../../components/AdminsContext/AdminsContext';

const UsersTable = () => {
  const { advisors } = useAdmins();

  const [status, setStatus] = useState({ $in: [USER_STATUS.QUALIFIED] });
  const [assignee, setAssignee] = useState();

  const assigneeOptions = [
    ...advisors.map(({ _id, firstName, office }) => ({
      id: _id,
      label: firstName,
      office,
    })),
    { id: undefined, label: 'Personne' },
  ];

  return (
    <>
      <MongoSelect
        label="Statut"
        value={status}
        onChange={setStatus}
        options={USER_STATUS}
        id="status"
        className="mr-8"
      />
      <MongoSelect
        label="Conseiller"
        value={assignee}
        options={assigneeOptions}
        onChange={setAssignee}
        grouping={{
          groupBy: 'office',
          format: office => <T id={`Forms.office.${office}`} />,
        }}
      />
      <DataTable
        initialPageSize={25}
        queryConfig={{
          query: USERS_COLLECTION,
          params: {
            $filters: { status, 'assignedEmployeeCache._id': assignee },
            emails: 1,
            firstName: 1,
            lastName: 1,
            createdAt: 1,
            roles: 1,
            assignedEmployeeCache: 1,
            status: 1,
          },
        }}
        queryDeps={[status, assignee]}
        initialSort={{ id: 'createdAt' }}
        columns={[
          {
            Header: 'Statut',
            accessor: 'status',
            Cell: ({ value: s }) => (
              <StatusLabel status={s} collection={USERS_COLLECTION} />
            ),
          },
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
    </>
  );
};

export default UsersTable;
