import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React from 'react';

import T from 'core/components/Translation/';
import TasksTableWithData from '../../components/TasksTable/TasksTableWithData';
import CreateUserDialogForm from './CreateUserDialogForm';

<<<<<<< HEAD:microservices/admin/imports/ui/pages/AdminDashboardPage/AdminDashboardPage.jsx
const AdminDashboardPage = () => (
  <section className="mask1">
=======
const AdminDashboardPage = props => (
  <section className="mask1 admin-dashboard-page">
>>>>>>> 2153bd1e6c91b464aa09d141687942f5890299e4:microservices/admin/imports/client/pages/AdminDashboardPage/AdminDashboardPage.jsx
    <h1>Admin Dashboard</h1>

    <CreateUserDialogForm />

    <h2 className="fixed-size text-center">
      <T id="AdminDashboardPage.tasks" />
    </h2>
    <TasksTableWithData
      showAssignee
      dashboardTasks
      assignedTo={Meteor.userId()}
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
