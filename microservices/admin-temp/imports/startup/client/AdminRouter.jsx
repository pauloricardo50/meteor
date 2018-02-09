import React from 'react';
// import { Route, Switch } from 'react-router-dom';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';

import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from '../../../lang/fr.json';

import {
  AdminLayout,
  AdminDashboardPage,
  UsersPage,
  LoansPage,
  // OfferPage,
  // SingleLoanPage,
  SingleUserPage
  // VerifyPage,
  // ContactLendersPage,
} from 'core/containers/AdminContainers';
import DevPage from 'core/components/DevPage';
import AdminLoanContainer from 'core/containers/AdminLoanContainer';

import SingleLoanPage from '../../ui/pages/SingleLoanPage';
import ContactLendersPage from '../../ui/pages/ContactLendersPage';
import OfferPage from '../../ui/pages/OfferPage';
import VerifyPage from '../../ui/pages/VerifyPage';

const AdminRouter = props => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
  >
    <AdminLayout
      {...props}
      type="admin"
      render={layoutProps => (
        <Switch>
          <Route
            exact
            path="/"
            render={() => <AdminDashboardPage {...layoutProps} />}
          />
          <Route
            exact
            path="/users"
            render={() => <UsersPage {...layoutProps} />}
          />
          <Route
            exact
            path="/loans"
            render={() => <LoansPage {...layoutProps} />}
          />
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
          <Route
            path="/loans/:loanId"
            component={AdminLoanContainer(SingleLoanPage)}
          />
          <Route path="/users/:userId" component={SingleUserPage} />
          <Route path="/dev" component={DevPage} />
          <Route component={NotFound} />
        </Switch>
      )}
    />
  </BaseRouter>
);

export default AdminRouter;
