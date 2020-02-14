import React from 'react';

import ContactTaskInserter from './ContactTaskInserter';
import TasksTable from '../../../components/TasksTable';
import SingleContactPageTasksContainer from './SingleContactPageTasksContainer';

const SingleContactPageTasks = ({
  contactId,
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
      <ContactTaskInserter
        contactId={contactId}
        refetch={refetch}
        model={model}
        openOnMount={openOnMount}
        resetForm={resetForm}
      />
    </div>
    <TasksTable tasks={tasks} relatedTo={false} {...rest} />
  </div>
);

export default SingleContactPageTasksContainer(SingleContactPageTasks);
