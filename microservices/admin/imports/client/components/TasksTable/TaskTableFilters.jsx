import React from 'react';

import Select from 'core/components/Select';
import T from 'core/components/Translation';
import { TASK_STATUS } from 'core/api/constants';
import { withSmartQuery } from 'imports/core/api/containerToolkit/index';
import { adminUsers } from 'core/api/users/queries';
import { ROLES } from 'imports/core/api/constants';

const uptoDateOptions = [
  { id: 'TODAY', label: "-> Aujourd'hui" },
  { id: 'TOMORROW', label: '-> Demain' },
  { id: 'ALL', label: 'Tout' },
];

const TaskTableFilters = ({
  admins = [],
  assignee,
  status,
  setStatus,
  setAssignee,
  uptoDate,
  setUptoDate,
}) => {
  const assigneeOptions = [
    ...admins.map(({ _id, firstName }) => ({ id: _id, label: firstName })),
    { _id: undefined, label: 'Personne' },
  ];
  return (
    <div className="flex space-children">
      {setAssignee && (
        <Select
          value={assignee.$in}
          multiple
          label="Assigné"
          options={assigneeOptions}
          onChange={selected => setAssignee({ $in: selected })}
        />
      )}

      {setStatus && (
        <Select
          value={status.$in}
          multiple
          label="Statut"
          options={Object.values(TASK_STATUS).map(t => ({
            id: t,
            label: <T id={`Forms.status.${t}`} />,
          }))}
          onChange={selected => setStatus({ $in: selected })}
        />
      )}

      {setUptoDate && (
        <Select
          value={uptoDate}
          label="Date"
          options={uptoDateOptions}
          onChange={value => setUptoDate(value)}
        />
      )}
    </div>
  );
};

export default withSmartQuery({
  query: adminUsers,
  params: { $body: { firstName: 1 }, roles: [ROLES.ADMIN, ROLES.DEV] },
  dataName: 'admins',
  queryOptions: { shouldRefetch: () => false },
  refetchOnMethodCall: false,
  skip: ({ setAssignee }) => !setAssignee,
})(TaskTableFilters);
