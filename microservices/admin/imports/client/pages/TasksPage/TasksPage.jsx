import React from 'react';
import { Helmet } from 'react-helmet';

import T from 'core/components/Translation';
import { TASKS_COLLECTION } from 'core/api/constants';
import Icon from 'core/components/Icon/Icon';
import collectionIcons from 'core/arrays/collectionIcons';
import AllTasksTable from '../../components/TasksTable/AllTasksTable';

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

    <AllTasksTable />
  </section>
);

export default TasksPage;
