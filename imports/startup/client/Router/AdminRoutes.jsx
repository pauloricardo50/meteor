import React from 'react';
import { Route, Switch } from 'react-router-dom';

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
} from '/imports/ui/containers/AdminContainers';
import AdminDevPage from '/imports/ui/pages/admin/AdminDevPage';
import NotFound from '/imports/ui/components/general/NotFound';

const AdminRoutes = props =>
  (<AdminLayout
    {...props}
    type="admin"
    render={layoutProps =>
      (<Switch>
        <Route
          exact
          path="/admin"
          render={() => <AdminDashboardPage {...layoutProps} />}
        />
        <Route
          exact
          path="/admin/users"
          render={() => <UsersPage {...layoutProps} />}
        />
        <Route
          exact
          path="/admin/requests"
          render={() => <RequestsPage {...layoutProps} />}
        />
        <Route
          path="/admin/requests/:requestId/verify"
          component={VerifyPage}
        />
        <Route
          path="/admin/requests/:requestId/contactlenders"
          component={ContactLendersPage}
        />
        <Route
          path="/admin/requests/:requestId/offers/:offerId"
          component={OfferPage}
        />
        <Route
          path="/admin/requests/:requestId"
          component={SingleRequestPage}
        />
        <Route path="/admin/users/:userId" component={SingleUserPage} />
        <Route
          exact
          path="/admin/dev"
          render={() => <AdminDevPage {...layoutProps} />}
        />
        <Route component={NotFound} />
      </Switch>)}
  />);

export default AdminRoutes;
