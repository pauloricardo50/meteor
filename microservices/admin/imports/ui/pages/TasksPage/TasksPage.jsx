import React from 'react';
import { T } from 'core/components/Translation';
import TasksTabs from './TasksTabs';

const TasksPage = props => (
  <section className="mask1" style={{ overflow: 'initial' }}>
    <h1>
      <T id="collections.tasks" />
    </h1>

    <TasksTabs {...props} />
  </section>
);

export default TasksPage;
