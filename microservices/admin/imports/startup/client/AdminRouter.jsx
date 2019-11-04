import React from 'react';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import { getUserLocale, getFormats } from 'core/utils/localization';
import { currentUser } from 'core/api/users/queries';
import messagesFR from '../../../lang/fr.json';
import AdminLayout from '../../client/layouts/AdminLayout';
import AdminStore from '../../client/components/AdminStore';
import ADMIN_ROUTES from './adminRoutes';

const AdminRoutes = props => (
  <Switch>
    {Object.keys(ADMIN_ROUTES).map(route => (
      <Route {...ADMIN_ROUTES[route]} {...props} key={route} />
    ))}
  </Switch>
);

const AdminRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    routes={ADMIN_ROUTES}
    currentUser={{
      query: currentUser,
      params: () => ({
        $body: {
          email: 1,
          emails: 1,
          name: 1,
          organisations: { name: 1 },
          roles: 1,
        },
      }),
    }}
  >
    <AdminStore>
      <AdminLayout type="admin">
        <AdminRoutes />
      </AdminLayout>
    </AdminStore>
  </BaseRouter>
);

export default AdminRouter;
