import { Meteor } from 'meteor/meteor';

import React from 'react';
import Tabs from 'core/components/Tabs';
import { T } from 'core/components/Translation/';
import TasksTableWithData from '../../components/TasksTable/TasksTableWithData';

const getTabs = () => [
  {
    id: 'myTasks',
    label: <T id="TasksTabs.myTasks" />,
    content: (
      <TasksTableWithData
        assignedTo={Meteor.userId()}
        showAssignee={false}
        key="myTasks"
      />
    ),
  },
  {
    id: 'unassignedTasks',
    label: <T id="TasksTabs.unassignedTasks" />,
    content: (
      <TasksTableWithData unassigned showAssignee key="unassignedTasks" />
    ),
  },
  {
    id: 'allTasks',
    label: <T id="TasksTabs.allTasks" />,
    content: <TasksTableWithData showAssignee all key="allTasks" />,
  },
];

const TasksTabs = (props) => {
  const tabs = getTabs(props);
  return <Tabs tabs={tabs} />;
};

export default TasksTabs;
