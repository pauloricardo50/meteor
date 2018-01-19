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
  RequestsPage,
  // OfferPage,
  // SingleRequestPage,
  SingleUserPage,
  // VerifyPage,
  // ContactLendersPage,
} from 'core/containers/AdminContainers';
import AdminDevPage from '/imports/ui/pages/AdminDevPage';
import AdminRequestContainer from 'core/containers/AdminRequestContainer';

import SingleRequestPage from '../../ui/pages/SingleRequestPage';
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
            path="/requests"
            render={() => <RequestsPage {...layoutProps} />}
          />
          <Route
            path="/requests/:requestId/verify"
            component={AdminRequestContainer(VerifyPage)}
          />
          <Route
            path="/requests/:requestId/contactlenders"
            component={AdminRequestContainer(ContactLendersPage)}
          />
          <Route
            path="/requests/:requestId/offers/:offerId"
            component={AdminRequestContainer(OfferPage)}
          />
          <Route
            path="/requests/:requestId"
            component={AdminRequestContainer(SingleRequestPage)}
          />
          <Route path="/users/:userId" component={SingleUserPage} />
          <Route
            exact
            path="/dev"
            render={() => <AdminDevPage {...layoutProps} />}
          />
          <Route component={NotFound} />
        </Switch>
      )}
    />
  </BaseRouter>
);

export default AdminRouter;
