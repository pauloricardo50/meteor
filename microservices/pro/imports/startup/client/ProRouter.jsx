// @flow
import React from 'react';

// Add this to prevent .finally errors on MS Edge
//
import 'babel-polyfill';
import 'core-js/modules/es7.promise.finally';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';
import { getUserLocale, getFormats } from 'core/utils/localization';
import DevPage from 'core/components/DevPage';
import ImpersonatePage from 'core/components/Impersonate/ImpersonatePage';
import { IMPERSONATE_ROUTE } from 'core/api/impersonation/impersonation';
import ProLayout from '../../client/layout';
import messagesFR from '../../../lang/fr.json';
import * as ROUTES from './proRoutes';

type ProRouterProps = {};

const ProRouter = (props: ProRouterProps) => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
  >
    <ProLayout>
      <Switch>
        <Route path={ROUTES.DEV_PAGE} component={DevPage} />
        <Route exact path={IMPERSONATE_ROUTE} component={ImpersonatePage} />
        <Route component={NotFound} />
      </Switch>
    </ProLayout>
  </BaseRouter>
);

export default ProRouter;
