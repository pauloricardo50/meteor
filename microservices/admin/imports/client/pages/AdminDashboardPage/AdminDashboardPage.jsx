import { Meteor } from 'meteor/meteor';
import React from 'react';

import T from 'core/components/Translation/';
import TasksTableWithData from '../../components/TasksTable/TasksTableWithData';
import CreateUserDialogForm from './CreateUserDialogForm';

const AdminDashboardPage = ({ currentUser }) => (
  <section className="mask1 admin-dashboard-page">
    <h1>Admin Dashboard</h1>

    <CreateUserDialogForm history={history} />

    <h2 className="fixed-size text-center">
      <T id="AdminDashboardPage.tasks" />
    </h2>
    <TasksTableWithData
      showAssignee
      dashboardTasks
      assignedTo={Meteor.userId()}
      tableFilters={{
        filters: { assignedEmployee: { emails: [{ address: true }] } },
        options: {
          address: [currentUser.emails[0].address, undefined],
        },
      }}
    />
  </section>
);

export default AdminDashboardPage;
