import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React from 'react';

import T from 'core/components/Translation/';
import TasksTableWithData from '../../components/TasksTable/TasksTableWithData';
import CreateUserDialogForm from './CreateUserDialogForm';

const AdminDashboardPage = () => (
  <section className="mask1 admin-dashboard-page">
    <h1>Admin Dashboard</h1>

    <CreateUserDialogForm />

    <h2 className="fixed-size text-center">
      <T id="AdminDashboardPage.tasks" />
    </h2>
    <TasksTableWithData
      showAssignee
      dashboardTasks
      assignedTo={Meteor.userId()}
      tableFilters={{ assignedEmployee: { emails: [{ address: true }] } }}
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
