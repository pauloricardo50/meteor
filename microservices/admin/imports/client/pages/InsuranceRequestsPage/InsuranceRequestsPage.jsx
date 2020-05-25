import React from 'react';
import { Helmet } from 'react-helmet';

import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import DataTable from 'core/components/DataTable';
import Icon from 'core/components/Icon/Icon';
import { CollectionIconLink } from 'core/components/IconLink';
import Link from 'core/components/Link';
import StatusLabel from 'core/components/StatusLabel';
import { IntlDate } from 'core/components/Translation';

const InsuranceRequestsPage = () => (
  <section className="card1 card-top insurance-requests-page">
    <Helmet>
      <title>Dossiers assurance</title>
    </Helmet>
    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[INSURANCE_REQUESTS_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      Dossiers assurance
    </h1>

    <DataTable
      queryConfig={{
        query: INSURANCE_REQUESTS_COLLECTION,
        params: {
          name: 1,
          userCache: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      }}
      initialSort={{ id: 'createdAt' }}
      columns={[
        { Header: 'No. de dossier', accessor: 'name' },
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
            <StatusLabel
              status={value}
              collection={INSURANCE_REQUESTS_COLLECTION}
            />
          ),
        },
        {
          Header: 'Créé',
          accessor: 'createdAt',
          Cell: ({ value }) => <IntlDate value={value} type="relative" />,
        },
      ]}
      addRowProps={({ original }) => ({
        component: Link,
        to: `/insuranceRequests/${original._id}`,
      })}
    />
  </section>
);

export default InsuranceRequestsPage;
