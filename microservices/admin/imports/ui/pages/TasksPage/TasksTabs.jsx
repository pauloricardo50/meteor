import React from 'react';
import Tabs from 'core/components/Tabs';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import TasksTableWithData from '../../components/TasksTable/TasksTableWithData';
import { T } from 'core/components/Translation/';

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
      <TasksTableWithData showAssignee unassigned key="unassignedTasks" />
    ),
  },
  {
    id: 'allTasks',
    label: <T id="TasksTabs.allTasks" />,
    content: <TasksTableWithData showAssignee key="allTasks" />,
  },
];

const TasksTabs = (props) => {
  const tabs = getTabs(props);
  const initialTab = tabs.findIndex(tab => tab.id === queryString.parse(props.location.search).tab);
  return <Tabs initialIndex={initialTab} tabs={tabs} />;
};

export default TasksTabs;
