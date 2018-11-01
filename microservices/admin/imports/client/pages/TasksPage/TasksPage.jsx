import React from 'react';
import T from 'core/components/Translation';
import { TASK_TYPE, TASK_STATUS } from 'core/api/constants';
import adminsQuery from 'core/api/users/queries/admins';
import AllTasksTable from '../../components/TasksTable/AllTasksTable';

const getAdminsEmails = async () => {
  const admins = await adminsQuery.clone().fetchSync();
  const adminsEmails = admins.map(({ email }) => email);
  return [...adminsEmails, undefined];
};

const tasksTableFilters = {
  filters: {
    type: true,
    status: [TASK_STATUS.ACTIVE],
    assignedEmployee: { emails: [{ address: true }] },
  },
  options: {
    type: Object.values(TASK_TYPE),
    status: Object.values(TASK_STATUS),
    address: getAdminsEmails(),
  },
};

const TasksPage = () => (
  <section
    className="card1 card-top tasks-page"
    style={{ overflow: 'initial' }}
  >
    <h1>
      <T id="collections.tasks" />
    </h1>

    <AllTasksTable tableFilters={tasksTableFilters} />
  </section>
);

export default TasksPage;
