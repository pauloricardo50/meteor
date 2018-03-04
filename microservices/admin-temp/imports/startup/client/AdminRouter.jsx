import React from 'react';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';

import { getUserLocale, getFormats } from 'core/utils/localization';
import {
  AdminLayout,
  AdminDashboardPage,
} from 'core/containers/AdminContainers';
import DevPage from 'core/components/DevPage';
import AdminLoanContainer from 'core/containers/AdminLoanContainer';

import DevPage from 'core/components/DevPage';
import messagesFR from '../../../lang/fr.json';

import ContactLendersPage from '../../ui/pages/ContactLendersPage';
import OfferPage from '../../ui/pages/OfferPage';
import VerifyPage from '../../ui/pages/VerifyPage';
import LoansPageWithData from '../../ui/pages/LoansPage/LoansPageWithData';
import SingleLoanPageWithData from '../../ui/pages/SingleLoanPage/SingleLoanPageWithData';

import UsersPageWithData from '../../ui/pages/UsersPage/UsersPageWithData';
import SingleUserPageWithData from '../../ui/pages/SingleUserPage/SingleUserPageWithData';
import TasksPage from '../../ui/pages/TasksPage/TasksPage';
import BorrowersPage from '../../ui/pages/BorrowersPage/BorrowersPageWithData';

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
        <Route exact path="/users" component={UsersPageWithData} />
        <Route exact path="/loans" component={LoansPageWithData} />
        <Route
          path="/loans/:loanId/verify"
          component={AdminLoanContainer(VerifyPage)}
        />
        <Route
          path="/loans/:loanId/contactlenders"
          component={AdminLoanContainer(ContactLendersPage)}
        />
        <Route
          path="/loans/:loanId/offers/:offerId"
          component={AdminLoanContainer(OfferPage)}
        />
        <Route path="/loans/:loanId" component={SingleLoanPageWithData} />
        <Route path="/users/:userId" component={SingleUserPageWithData} />
        <Route path="/tasks" component={TasksPage} />
        <Route path="/borrowers" component={BorrowersPage} />
        <Route path="/dev" component={DevPage} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  </BaseRouter>
);

export default AdminRouter;
