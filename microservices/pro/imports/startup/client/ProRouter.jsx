import React from 'react';

import { proUser } from 'core/api/users/queries';
import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import { getFormats, getUserLocale } from 'core/utils/localization';

import messagesFR from '../../../lang/fr.json';
import ProLayout from '../../client/layout/loadable';
import PRO_ROUTES from './proRoutes';

const ProRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    routes={PRO_ROUTES}
    currentUser={{
      query: proUser,
      params: {
        $body: {
          apiPublicKey: 1,
          assignedEmployee: { email: 1, name: 1 },
          currentUser: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          name: 1,
          organisations: { name: 1, commissionRates: { _id: 1 } },
          phoneNumbers: 1,
          promotions: { status: 1, userLinks: 1 },
          proProperties: { userLinks: 1, status: 1 },
          roles: 1,
        },
      },
    }}
  >
    <ProLayout>
      <Switch>
        {Object.keys(PRO_ROUTES).map(route => (
          <Route {...PRO_ROUTES[route]} key={route} />
        ))}
      </Switch>
    </ProLayout>
  </BaseRouter>
);

export default ProRouter;
