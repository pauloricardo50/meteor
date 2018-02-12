import React from 'react';
import Tabs from 'core/components/Tabs';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import TasksTabContainer from './TasksTabContainer';
import { T } from '../../../core/components/Translation/';

const getTabs = props => [
  { id: 'myTasks', label: <T id={`TasksTabs.myTasks`} />, content: <TasksTabContainer {...props} userId={ Meteor.userId()} showAsignee={false}/> },
  { id: 'allTasks', label: <T id={`TasksTabs.allTasks`} />, content: <TasksTabContainer {...props} showAsignee={true}/> },
];

const TasksTabs = (props) => {
  const tabs = getTabs(props);
  const initialTab = tabs.findIndex(tab => tab.id === queryString.parse(props.location.search).tab);
  return <Tabs initialIndex={initialTab} tabs={tabs} />;
};


export default TasksTabs;