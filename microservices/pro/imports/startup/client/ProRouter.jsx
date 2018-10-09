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
import PasswordResetPage from 'core/components/PasswordResetPage';
import EmailVerificationPage from 'core/components/EmailVerificationPage';
import AccountPage from 'core/components/AccountPage';
import ProLayout from '../../client/layout';
import messagesFR from '../../../lang/fr.json';
import * as ROUTES from './proRoutes';
import ProDashboardPage from '../../client/pages/ProDashboardPage';

type ProRouterProps = {};

const ProRouter = (props: ProRouterProps) => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
  >
    <ProLayout>
      <Switch>
        <Route path={ROUTES.ACCOUNT_PAGE} component={AccountPage} />
        <Route path={ROUTES.PRO_DASHBOARD_PAGE} component={ProDashboardPage} />
        <Route path={ROUTES.DEV_PAGE} component={DevPage} />
        <Route
          path={ROUTES.PASSWORD_RESET_PAGE}
          component={PasswordResetPage}
        />
        <Route
          path={ROUTES.ENROLL_ACCOUNT_PAGE}
          component={PasswordResetPage}
        />
        <Route
          path={ROUTES.EMAIL_VERIFICATION_PAGE}
          component={EmailVerificationPage}
        />
        <Route exact path={IMPERSONATE_ROUTE} component={ImpersonatePage} />
        <Route component={NotFound} />
      </Switch>
    </ProLayout>
  </BaseRouter>
);

export default ProRouter;
