import React from 'react';
import Tabs from 'core/components/Tabs';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import UsersTable from './UsersTable';
import { T } from 'core/components/Translation/';

const getTabs = props => [
  {
    id: 'myUsers',
    label: <T id="UsersTabs.myUsers" />,
    content: (
      <UsersTable
        {...props}
        assignedTo={Meteor.userId()}
        showAssignee={false}
        key="myUsers"
      />
    ),
  },
  {
    id: 'allUsers',
    label: <T id="UsersTabs.allUsers" />,
    content: <UsersTable {...props} showAssignee key="allUsers" />,
  },
];

const UsersTabs = (props) => {
  const tabs = getTabs(props);
  const initialTab = tabs.findIndex(tab => tab.id === queryString.parse(props.location.search).tab);
  return <Tabs initialIndex={initialTab} tabs={tabs} />;
};

export default UsersTabs;
