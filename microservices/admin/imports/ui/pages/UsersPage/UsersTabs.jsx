import React from 'react';
import Tabs from 'core/components/Tabs';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { T } from 'core/components/Translation/';
import UsersTable from './UsersTable';

const getTabs = props => [
  {
    id: 'myUsers',
    label: <T id="UsersTabs.myUsers" />,
    content: (
      <UsersTable
        assignedTo={Meteor.userId()}
        showAssignee={false}
        history={props.history}
        key="myUsers"
      />
    ),
  },
  {
    id: 'allUsers',
    label: <T id="UsersTabs.allUsers" />,
    content: <UsersTable showAssignee key="allUsers" history={props.history} />,
  },
];

const UsersTabs = (props) => {
  const tabs = getTabs(props);
  const initialTab = tabs.findIndex(tab => tab.id === queryString.parse(props.location.search).tab);
  return <Tabs initialIndex={initialTab} tabs={tabs} />;
};

export default UsersTabs;
