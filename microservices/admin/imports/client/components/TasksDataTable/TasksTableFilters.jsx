import React from 'react';

import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import Select from 'core/components/Select';
import MongoSelect from 'core/components/Select/MongoSelect';
import T from 'core/components/Translation';

import { useAdmins } from '../AdminsContext/AdminsContext';

const uptoDateOptions = [
  { id: 'TODAY', label: "-> Aujourd'hui" },
  { id: 'TOMORROW', label: '-> Demain' },
  { id: 'ALL', label: 'Tout' },
];

const TasksTableFilters = ({
  assignee,
  status,
  setStatus,
  setAssignee,
  uptoDate,
  setUptoDate,
  additionalFilters,
}) => {
  const { advisors } = useAdmins();
  const assigneeOptions = [
    ...advisors.map(({ _id, firstName, office }) => ({
      id: _id,
      label: firstName,
      office,
    })),
    { id: undefined, label: 'Personne' },
  ];
  return (
    <div className="flex">
      {setAssignee && (
        <MongoSelect
          value={assignee}
          label="Assigné"
          options={assigneeOptions}
          onChange={setAssignee}
          className="mr-8"
          grouping={{
            groupBy: 'office',
            format: office => <T id={`Forms.office.${office}`} />,
          }}
        />
      )}

      {setStatus && (
        <MongoSelect
          value={status}
          onChange={setStatus}
          label="Statut"
          id="status"
          options={TASK_STATUS}
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

export default TasksTableFilters;
