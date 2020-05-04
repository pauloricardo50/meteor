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
    currentUser={{ query: proUser }}
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
