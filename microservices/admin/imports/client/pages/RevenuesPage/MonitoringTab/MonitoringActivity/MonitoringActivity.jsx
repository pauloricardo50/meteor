import React from 'react';

import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import TableWithModal from 'core/components/Table/TableWithModal';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import MonitoringActivityContainer from './MonitoringActivityContainer';
import {
  getColumnOptions,
  getRows,
  makeGetModalProps,
} from './monitoringActivityHelpers';

const sharedColumnOptions = [
  { id: 'assignee', label: 'Conseiller principal' },
  { id: 'count', label: 'Nb. de dossiers distincts' },
];

const MonitoringActivity = ({
  createdAtRange,
  data = [],
  staticData,
  staticDataIsLoading,
  collection,
}) => {
  const hasCreatedAtRange = createdAtRange.startDate || createdAtRange.endDate;
  const { data: admins, loading: usersLoading } = useStaticMeteorData({
    query: USERS_COLLECTION,
    params: {
      $filters: { 'roles._id': ROLES.ADVISOR },
      firstName: 1,
      $options: { sort: { firstName: 1 } },
    },
  });

  const isLoading = hasCreatedAtRange
    ? usersLoading && staticDataIsLoading
    : usersLoading;

  const rows = isLoading
    ? []
    : getRows({
        data,
        admins,
        staticData,
        hasCreatedAtRange,
        collection,
      });

  return (
    <TableWithModal
      modalType="dialog"
      rows={rows}
      columnOptions={[
        ...sharedColumnOptions,
        ...getColumnOptions({
          hasCreatedAtRange,
          collection,
        }),
      ]}
      initialOrderBy="count"
      getModalProps={makeGetModalProps({ collection })}
    />
  );
};

export default MonitoringActivityContainer(MonitoringActivity);
