import React from 'react';
import { Helmet } from 'react-helmet';

import T from 'core/components/Translation';
import { TASK_TYPE, TASK_STATUS, TASKS_COLLECTION } from 'core/api/constants';
import adminsQuery from 'core/api/users/queries/admins';
import Icon from 'core/components/Icon/Icon';
import collectionIcons from 'core/arrays/collectionIcons';
import AllTasksTable from '../../components/TasksTable/AllTasksTable';

const getAdminsEmails = async () => {
  try {
    const admins = await adminsQuery.clone().fetchSync();
    const adminsEmails = admins.map(({ email }) => email);
    return [...adminsEmails, undefined];
  } catch (error) {
    return [undefined];
  }
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
    <Helmet>
      <title>Tâches</title>
    </Helmet>
    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[TASKS_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      <T id="collections.tasks" />
    </h1>

    <AllTasksTable tableFilters={tasksTableFilters} />
  </section>
);

export default TasksPage;
