// @flow
import React from 'react';

// // Add this to prevent .finally errors on MS Edge
// //
// import 'babel-polyfill';
// import 'core-js/modules/es7.promise.finally';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import { getUserLocale, getFormats } from 'core/utils/localization';

import messagesFR from '../../../lang/fr.json';
import ProLayout from '../../client/layout/loadable';
import PRO_ROUTES from './proRoutes';

const ProRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    routes={PRO_ROUTES}
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
