import React from 'react';

import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import TableWithModal from 'core/components/DataTable/Table/TableWithModal';
import Loading from 'core/components/Loading/Loading';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';
import useMeteorData from 'core/hooks/useMeteorData';

import MonitoringActivityContainer from './MonitoringActivityContainer';
import { collectionStatuses } from './monitoringActivityHelpers';
import MonitoringActivityModalList from './MonitoringActivityModalList';

const getTotal = (data, key) =>
  data.reduce((tot, row) => tot + (row[key] || 0), 0);

const MonitoringActivity = ({ data = [], loading, collection }) => {
  const { data: admins, loading: usersLoading } = useMeteorData({
    query: USERS_COLLECTION,
    params: {
      $filters: { 'roles._id': ROLES.ADVISOR },
      firstName: 1,
      $options: { sort: { firstName: 1 } },
    },
  });

  if (usersLoading || loading) {
    return <Loading />;
  }

  return (
    <TableWithModal
      data={data}
      columns={[
        {
          Header: 'Conseiller principal',
          accessor: ({ _id }) =>
            admins.find(({ _id: adminId }) => _id === adminId)?.firstName ||
            'Personne',
        },
        {
          Header: (
            <div className="flex-col center-align">
              <div>Dossiers uniques</div>
              <div>Total: {getTotal(data, 'uniques')}</div>
            </div>
          ),
          accessor: 'uniques',
        },
        ...collectionStatuses[collection].map(status => {
          const total = getTotal(data, status);
          return {
            Header: (
              <div className="flex-col center-align">
                <div className="mb-4">
                  ->
                  <StatusLabel collection={collection} status={status} />
                </div>
                <div>Total: {total} </div>
              </div>
            ),
            accessor: status,
          };
        }),
      ].filter(x => x)}
      getModalProps={({ _id, docIds }) => {
        const firstName =
          admins.find(({ _id: adminId }) => _id === adminId)?.firstName ||
          'Personne';
        return {
          title: firstName,
          children: (
            <MonitoringActivityModalList
              docIds={docIds}
              collection={collection}
            />
          ),
        };
      }}
      modalType="dialog"
    />
  );
};

export default MonitoringActivityContainer(MonitoringActivity);
