import React from 'react';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from '../../../lang/fr.json';
import AppLayout from '../../client/layouts/AppLayout/loadable';
import AppStore from '../../client/components/AppStore';

import APP_ROUTES from './appRoutes';

const AppRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    WrapperComponent={AppStore}
    routes={APP_ROUTES}
  >
    <AppLayout>
      <Switch>
        {Object.keys(APP_ROUTES).map(route => (
          <Route {...APP_ROUTES[route]} key={route} />
        ))}
      </Switch>
    </AppLayout>
  </BaseRouter>
);

export default AppRouter;
