import React from 'react';

import Select from 'core/components/Select';
import T from 'core/components/Translation';
import { TASK_STATUS, ROLES } from 'core/api/constants';
import { withSmartQuery } from 'core/api/containerToolkit';
import { adminUsers } from 'core/api/users/queries';

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
  additionalFilters,
}) => {
  const assigneeOptions = [
    ...admins.map(({ _id, firstName }) => ({ id: _id, label: firstName })),
    { _id: undefined, label: 'Personne' },
  ];
  return (
    <div className="flex">
      {setAssignee && (
        <Select
          value={assignee.$in}
          multiple
          label="Assigné"
          options={assigneeOptions}
          onChange={selected => setAssignee({ $in: selected })}
          className="mr-8"
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
          className="mr-8"
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

      {additionalFilters}
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
