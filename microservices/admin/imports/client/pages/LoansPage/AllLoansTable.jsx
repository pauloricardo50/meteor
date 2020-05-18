import React, { useState } from 'react';

import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import DataTable from 'core/components/DataTable';
import { CollectionIconLink } from 'core/components/IconLink';
import Link from 'core/components/Link';
import Select from 'core/components/Select';
import StatusLabel from 'core/components/StatusLabel';
import { IntlDate, Money } from 'core/components/Translation';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

const AllLoansTable = () => {
  const [assignees, setAssignees] = useState([]);
  const { data: admins = [], loading } = useStaticMeteorData({
    query: USERS_COLLECTION,
    params: {
      $filters: { 'roles._id': ROLES.ADMIN },
      firstName: 1,
      $options: { sort: { firstName: 1 } },
    },
  });

  return (
    <>
      {!loading && (
        <Select
          label="Conseiller"
          value={assignees}
          onChange={setAssignees}
          options={admins.map(({ _id, firstName }) => ({
            id: _id,
            label: firstName,
          }))}
          style={{ minWidth: 200 }}
          multiple
        />
      )}

      <DataTable
        queryConfig={{
          query: LOANS_COLLECTION,
          params: {
            $filters: assignees.length
              ? { 'assigneeLinks._id': { $in: assignees } }
              : {},
            createdAt: 1,
            name: 1,
            status: 1,
            structureCache: { wantedLoan: 1 },
            userCache: 1,
          },
        }}
        queryDeps={[assignees]}
        columns={[
          { Header: 'Nom', accessor: 'name' },
          {
            Header: 'Compte',
            accessor: 'userCache.lastName',
            Cell: ({ row: { original } }) => {
              if (!original.userCache?._id) {
                return null;
              }

              return (
                <CollectionIconLink
                  relatedDoc={{
                    ...original.userCache,
                    _collection: USERS_COLLECTION,
                  }}
                />
              );
            },
          },
          {
            Header: 'Statut',
            accessor: 'status',
            Cell: ({ value }) => (
              <StatusLabel status={value} collection={LOANS_COLLECTION} />
            ),
          },
          {
            Header: 'Créé',
            accessor: 'createdAt',
            Cell: ({ value }) => <IntlDate value={value} type="relative" />,
          },
          {
            Header: 'PH',
            accessor: 'structureCache.wantedLoan',
            align: 'right',
            Cell: ({ value }) => <Money value={value} />,
          },
        ]}
        addRowProps={({ original }) => ({
          component: Link,
          to: `/loans/${original._id}`,
        })}
      />
    </>
  );
};

export default AllLoansTable;
