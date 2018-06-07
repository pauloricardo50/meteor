import { Meteor } from 'meteor/meteor';

import React from 'react';
import Tabs from 'core/components/Tabs';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import T from 'core/components/Translation/';
import UsersTable from './UsersTable';

const getTabs = ({ history }) => [
  {
    id: 'myUsers',
    label: <T id="UsersTabs.myUsers" />,
    content: (
      <UsersTable
        assignedTo={Meteor.userId()}
        showAssignee={false}
        history={history}
        key="myUsers"
      />
    ),
  },
  {
    id: 'allUsers',
    label: <T id="UsersTabs.allUsers" />,
    content: <UsersTable showAssignee key="allUsers" history={history} />,
  },
];

const UsersTabs = ({ location, history }) => {
  const tabs = getTabs({ history });
  const initialTab = tabs.findIndex(tab => tab.id === queryString.parse(location.search).tab);
  return <Tabs initialIndex={initialTab} tabs={tabs} />;
};

UsersTabs.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default UsersTabs;
