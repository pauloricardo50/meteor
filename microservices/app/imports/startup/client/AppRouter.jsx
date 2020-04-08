import React from 'react';

import { appUser } from 'core/api/users/queries';
import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import { dataLayer } from 'core/utils/googleTagManager';
import { getFormats, getUserLocale } from 'core/utils/localization';

import messagesFR from '../../../lang/fr.json';
import AppStore from '../../client/components/AppStore';
import AppLayout from '../../client/layouts/AppLayout';
import APP_ROUTES from './appRoutes';

const AppRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    routes={APP_ROUTES}
    currentUser={{ query: appUser }}
    loginPageProps={{
      onSignInSuccess: () => {
        if (dataLayer()) {
          dataLayer().push({
            event: 'formSubmission',
            formType: 'Login',
          });
        }
      },
    }}
  >
    <AppStore>
      <AppLayout>
        <Switch>
          {Object.keys(APP_ROUTES).map(route => (
            <Route {...APP_ROUTES[route]} key={route} />
          ))}
        </Switch>
      </AppLayout>
    </AppStore>
  </BaseRouter>
);

export default AppRouter;
