import React from 'react';
import { Route, Switch } from 'react-router-dom';

import BaseRouter from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';

import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from '../../../lang/fr.json';

import {
  AdminLayout,
  AdminDashboardPage,
  UsersPage,
  RequestsPage,
  OfferPage,
  SingleRequestPage,
  SingleUserPage,
  VerifyPage,
  ContactLendersPage,
} from 'core/containers/AdminContainers';
import AdminDevPage from '/imports/ui/pages/admin/AdminDevPage';

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
          <Route path="/requests/:requestId/verify" component={VerifyPage} />
          <Route
            path="/requests/:requestId/contactlenders"
            component={ContactLendersPage}
          />
          <Route
            path="/requests/:requestId/offers/:offerId"
            component={OfferPage}
          />
          <Route path="/requests/:requestId" component={SingleRequestPage} />
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
