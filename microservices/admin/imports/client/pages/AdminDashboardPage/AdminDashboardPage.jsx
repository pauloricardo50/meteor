import { Meteor } from 'meteor/meteor';
import React from 'react';

import T from 'core/components/Translation/';
import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import TasksTableWithData from '../../components/TasksTable/TasksTableWithData';
import CreateUserDialogForm from './CreateUserDialogForm';
import MyLoansTable from './MyLoansTable';

const AdminDashboardPage = ({ currentUser, history }) => (
  <section className="card1 card-top admin-dashboard-page">
    <h1>Admin Dashboard</h1>

    <CreateUserDialogForm history={history} currentUser={currentUser} />

    <h2 className="text-center">Mes dossiers</h2>
    <MyLoansTable currentUser={currentUser} />

    <h2 className="text-center">
      <T id="AdminDashboardPage.tasks" />
    </h2>
    <TasksTableWithData
      showAssignee
      dashboardTasks
      assignedTo={Meteor.userId()}
      tableFilters={{
        filters: {
          assignedEmployee: { emails: [{ address: true }] },
          status: [TASK_STATUS.ACTIVE],
        },
        options: {
          address: [currentUser.email, undefined],
          status: Object.values(TASK_STATUS),
        },
      }}
    />
  </section>
);

export default AdminDashboardPage;
