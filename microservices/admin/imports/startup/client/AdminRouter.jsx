import React from 'react';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from '../../../lang/fr.json';
import AdminLayout from '../../client/layouts/AdminLayout';
import AdminStore from '../../client/components/AdminStore';
import ADMIN_ROUTES from './adminRoutes';

const AdminRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    WrapperComponent={AdminStore}
    routes={ADMIN_ROUTES}
  >
    <AdminLayout type="admin">
      <Switch>
        {Object.keys(ADMIN_ROUTES).map(route => (
          <Route {...ADMIN_ROUTES[route]} key={route} />
        ))}
      </Switch>
    </AdminLayout>
  </BaseRouter>
);

export default AdminRouter;
