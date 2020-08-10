import React from 'react';
import { Route as RRDRoute } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import { appUser } from 'core/api/users/queries';
import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import { dataLayer } from 'core/utils/googleTagManager';
import { getFormats, getUserLocale } from 'core/utils/localization';

import messagesFR from '../../../lang/fr.json';
import AppLayout from '../../client/layouts/AppLayout';
import APP_ROUTES from './appRoutes';

const AppRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    routes={APP_ROUTES}
    currentUser={{
      query: appUser,
      params: {
        $body: {
          assignedEmployee: { email: 1, name: 1 },
          currentUser: 1,
          email: 1,
          emails: 1,
          firstName: 1,
          lastName: 1,
          loans: {
            name: 1,
            customName: 1,
            purchaseType: 1,
            propertyIds: 1,
          },
          name: 1,
          organisations: { name: 1 },
          phoneNumbers: 1,
          roles: 1,
          status: 1,
        },
      },
    }}
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
    <QueryParamProvider ReactRouterRoute={RRDRoute}>
      <AppLayout>
        <Switch>
          {Object.keys(APP_ROUTES).map(route => (
            <Route {...APP_ROUTES[route]} key={route} />
          ))}
        </Switch>
      </AppLayout>
    </QueryParamProvider>
  </BaseRouter>
);

export default AppRouter;
