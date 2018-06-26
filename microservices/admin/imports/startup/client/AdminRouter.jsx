import React from 'react';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';

import { getUserLocale, getFormats } from 'core/utils/localization';
import DevPage from 'core/components/DevPage';

import messagesFR from '../../../lang/fr.json';

import AdminLayout from '../../client/layouts/AdminLayout';
import AdminDashboardPage from '../../client/pages/AdminDashboardPage';
import LoansPage from '../../client/pages/LoansPage';
import SingleLoanPage from '../../client/pages/SingleLoanPage';
import UsersPage from '../../client/pages/UsersPage/UsersPage';
import SingleUserPage from '../../client/pages/SingleUserPage';
import TasksPage from '../../client/pages/TasksPage/TasksPage';
import BorrowersPage from '../../client/pages/BorrowersPage';
import SearchPage from '../../client/pages/SearchPage/SearchPage';
import AdminAccountPage from '../../client/pages/AdminAccountPage';
import SinglePropertyPage from '../../client/pages/SinglePropertyPage';
import SingleBorrowerPage from '../../client/pages/SingleBorrowerPage';

import AdminStore from '../../client/components/AdminStore';

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
        <Route path="/loans/:loanId/:tabId?" component={SingleLoanPage} />
        <Route path="/users/:userId" component={SingleUserPage} />
        <Route
          path="/properties/:propertyId"
          component={SinglePropertyPage}
          className="mask1"
        />
        <Route path="/tasks" component={TasksPage} />
        <Route path="/borrowers/:borrowerId" component={SingleBorrowerPage} />
        <Route path="/borrowers" component={BorrowersPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/account" component={AdminAccountPage} />
        <Route path="/dev" component={DevPage} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  </BaseRouter>
);

export default AdminRouter;
