import React from 'react';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';

import { getUserLocale, getFormats } from 'core/utils/localization';
import DevPage from 'core/components/DevPage';

import messagesFR from '../../../lang/fr.json';

import AdminLayout from '../../ui/layouts/AdminLayout';
import AdminDashboardPage from '../../ui/pages/AdminDashboardPage';
import LoansPage from '../../ui/pages/LoansPage';
import SingleLoanPage from '../../ui/pages/SingleLoanPage';
import UsersPage from '../../ui/pages/UsersPage/UsersPage';
import SingleUserPage from '../../ui/pages/SingleUserPage';
import TasksPage from '../../ui/pages/TasksPage/TasksPage';
import BorrowersPage from '../../ui/pages/BorrowersPage';
import SearchPage from '../../ui/pages/SearchPage/SearchPage';

import AdminStore from '../../ui/components/AdminStore';

const AdminRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    WrapperComponent={AdminStore}
  >
    <AdminLayout type="admin">
      <Switch>
        <Route exact path="/" component={AdminDashboardPage} />
        <Route exact path="/users" component={UsersPage} />
        <Route exact path="/loans" component={LoansPage} />
        <Route path="/loans/:loanId" component={SingleLoanPage} />
        <Route path="/users/:userId" component={SingleUserPage} />
        <Route path="/tasks" component={TasksPage} />
        <Route path="/borrowers" component={BorrowersPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/dev" component={DevPage} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  </BaseRouter>
);

export default AdminRouter;
