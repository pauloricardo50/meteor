import React from 'react';

import OrganisationTaskInserter from './OrganisationTaskInserter';
import TasksTable from '../../../components/TasksTable';
import OrganisationTasksContainer from './OrganisationTasksContainer';

const OrganisationTasks = ({ organisationId, refetch, tasks, ...rest }) => (
  <div>
    <div className="flex">
      <h3>Tâches</h3>
      <OrganisationTaskInserter
        organisationId={organisationId}
        refetch={refetch}
      />
    </div>
    <TasksTable tasks={tasks} relatedTo={false} {...rest} />
  </div>
);

export default OrganisationTasksContainer(OrganisationTasks);
