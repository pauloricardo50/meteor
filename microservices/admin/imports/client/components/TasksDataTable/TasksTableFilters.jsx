import React from 'react';

import { withSmartQuery } from 'core/api/containerToolkit';
import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import Select from 'core/components/Select';
import T from 'core/components/Translation';

const uptoDateOptions = [
  { id: 'TODAY', label: "-> Aujourd'hui" },
  { id: 'TOMORROW', label: '-> Demain' },
  { id: 'ALL', label: 'Tout' },
];

const TasksTableFilters = ({
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
    ...admins.map(({ _id, firstName, office }) => ({
      id: _id,
      label: firstName,
      office,
    })),
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
          grouping={{
            groupBy: 'office',
            format: office => <T id={`Forms.office.${office}`} />,
          }}
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
  query: USERS_COLLECTION,
  params: {
    $filters: { 'roles._id': ROLES.ADVISOR },
    firstName: 1,
    office: 1,
    $options: { sort: { firstName: 1 } },
  },
  dataName: 'admins',
  queryOptions: { shouldRefetch: () => false },
  refetchOnMethodCall: false,
  skip: ({ setAssignee }) => !setAssignee,
})(TasksTableFilters);
