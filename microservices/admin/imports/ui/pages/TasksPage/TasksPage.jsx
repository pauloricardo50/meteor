import React from 'react';
import { Tabs, Tab } from 'material-ui';
import TasksTabs from './TasksTabs';

const TasksPage = props => (
  <section className="mask1" style={{ overflow: 'initial' }}>
    <h1>Tasks</h1>

    <TasksTabs {...props} />
  </section>
);

export default TasksPage;
