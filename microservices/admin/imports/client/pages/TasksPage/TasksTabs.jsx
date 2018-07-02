import { Meteor } from 'meteor/meteor';

import React from 'react';
import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation/';
import { TASK_TYPE, TASK_STATUS } from 'core/api/constants';

import TasksTableWithData from '../../components/TasksTable/TasksTableWithData';

const tasksTableFilters = {
  filters: { type: true, status: true },
  options: {
    type: Object.values(TASK_TYPE),
    status: Object.values(TASK_STATUS),
  },
};

export const getTabs = () => [
  {
    id: 'myTasks',
    label: <T id="TasksTabs.myTasks" />,
    content: (
      <TasksTableWithData
        assignedTo={Meteor.userId()}
        showAssignee={false}
        key="myTasks"
        tableFilters={tasksTableFilters}
      />
    ),
  },
  {
    id: 'unassignedTasks',
    label: <T id="TasksTabs.unassignedTasks" />,
    content: (
      <TasksTableWithData
        unassigned
        showAssignee
        key="unassignedTasks"
        tableFilters={tasksTableFilters}
      />
    ),
  },
  {
    id: 'allTasks',
    label: <T id="TasksTabs.allTasks" />,
    content: (
      <TasksTableWithData
        showAssignee
        all
        key="allTasks"
        tableFilters={tasksTableFilters}
      />
    ),
  },
];

const TasksTabs = (props) => {
  const tabs = getTabs(props);
  return <Tabs tabs={tabs} />;
};

export default TasksTabs;
