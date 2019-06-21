// @flow
import React from 'react';

import Select from 'core/components/Select';
import T from 'core/components/Translation';
import { TASK_STATUS } from 'core/api/constants';
import { withSmartQuery } from 'imports/core/api/containerToolkit/index';
import { adminUsers } from 'core/api/users/queries';
import { ROLES } from 'imports/core/api/constants';

type TaskTableFiltersProps = {};

const uptoDateOptions = [
  { id: 'TODAY', label: "Aujourd'hui" },
  { id: 'TOMORROW', label: 'Demain' },
  { id: 'ALL', label: 'Tout' },
];

const TaskTableFilters = ({
  admins,
  assignee,
  status,
  setStatus,
  setAssignee,
  uptoDate,
  setUptoDate,
}: TaskTableFiltersProps) => {
  const assigneeOptions = [
    ...admins.map(({ _id, firstName }) => ({ id: _id, label: firstName })),
    { _id: undefined, label: 'Personne' },
  ];
  return (
    <div className="flex space-children">
      <Select
        value={assignee.$in}
        multiple
        label="Assigné"
        options={assigneeOptions}
        onChange={(_, selected) => setAssignee({ $in: selected })}
        renderValue={value =>
          value
            .map((v) => {
              const admin = assigneeOptions.find(({ id }) => id === v);
              if (admin) {
                return admin.label;
              }

              return '???';
            })
            .map((v, i) => [i !== 0 && ', ', v])
        }
      />

      <Select
        value={status.$in}
        multiple
        label="Statut"
        options={Object.values(TASK_STATUS).map(t => ({
          id: t,
          label: <T id={`Forms.status.${t}`} />,
        }))}
        onChange={(_, selected) => setStatus({ $in: selected })}
        renderValue={value =>
          value.map((v, i) => [
            i !== 0 && ', ',
            <T key={value} id={`Forms.status.${v}`} />,
          ])
        }
      />

      <Select
        value={uptoDate}
        label="Date"
        options={uptoDateOptions}
        onChange={(_, value) => setUptoDate(value)}
      />
    </div>
  );
};

export default withSmartQuery({
  query: adminUsers,
  params: { $body: { firstName: 1 }, roles: [ROLES.ADMIN, ROLES.DEV] },
  dataName: 'admins',
  queryOptions: { shouldRefetch: () => false },
  refetchOnMethodCall: false,
})(TaskTableFilters);
