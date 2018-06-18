import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React from 'react';

import T from 'core/components/Translation/';
import TasksTableWithData from '../../components/TasksTable/TasksTableWithData';

const AdminDashboardPage = props => (
  <section className="mask1 admin-dashboard-page">
    <h1>Admin Dashboard</h1>

    <h2 className="fixed-size text-center">
      <T id="AdminDashboardPage.tasks" />
    </h2>
    <TasksTableWithData
      showAssignee
      dashboardTasks
      assignedTo={Meteor.userId()}
      tableFilters={{ type: 1, assignedEmployee: { emails: [{ address: 1 }] } }}
    />
  </section>
);

AdminDashboardPage.defaultProps = {
  loans: [],
  users: [],
  offers: [],
};

AdminDashboardPage.propTypes = {
  loans: PropTypes.arrayOf(PropTypes.object),
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object),
};

export default AdminDashboardPage;
