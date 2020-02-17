import React from 'react';

import UserTaskInserter from './UserTaskInserter';
import TasksTable from '../../../components/TasksTable';
import SingleUserPageTasksContainer from './SingleUserPageTasksContainer';

const SingleUserPageTasks = ({
  user,
  refetch,
  tasks,
  model,
  openOnMount,
  resetForm,
  ...rest
}) => (
  <div>
    <div className="flex">
      <h3>Tâches</h3>
      <UserTaskInserter
        user={user}
        refetch={refetch}
        model={model}
        openOnMount={openOnMount}
        resetForm={resetForm}
      />
    </div>
    <TasksTable tasks={tasks} relatedTo={false} {...rest} />
  </div>
);

export default SingleUserPageTasksContainer(SingleUserPageTasks);
