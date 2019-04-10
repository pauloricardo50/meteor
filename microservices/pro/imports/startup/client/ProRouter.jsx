// @flow
import React from 'react';

// // Add this to prevent .finally errors on MS Edge
// //
// import 'babel-polyfill';
// import 'core-js/modules/es7.promise.finally';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';
import { getUserLocale, getFormats } from 'core/utils/localization';
import DevPage from 'core/components/DevPage';
import ImpersonatePage from 'core/components/Impersonate/ImpersonatePage';
import { IMPERSONATE_ROUTE } from 'core/api/impersonation/impersonation';
import PasswordResetPage from 'core/components/PasswordResetPage';
import EmailVerificationPage from 'core/components/EmailVerificationPage';
import AccountPage from 'core/components/AccountPage';

import ProRevenuesPage from '../../client/pages/ProRevenuesPage/loadable';
import ProProPropertyPage from '../../client/pages/ProProPropertyPage/loadable';
import ProLayout from '../../client/layout';
import messagesFR from '../../../lang/fr.json';
import * as ROUTES from './proRoutes';
import ProDashboardPage from '../../client/pages/ProDashboardPage/loadable';
import ProPromotionPage from '../../client/pages/ProPromotionPage/loadable';
import ProPromotionLotPage from '../../client/pages/ProPromotionLotPage/loadable';
import ProPromotionUsersPage from '../../client/pages/ProPromotionUsersPage/loadable';
import ProOrganisationPage from '../../client/pages/ProOrganisationPage/loadable';

const ProRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
  >
    <ProLayout>
      <Switch>
        <Route path={ROUTES.PRO_PROPERTY_PAGE} component={ProProPropertyPage} />
        <Route
          path={ROUTES.PRO_PROMOTION_LOT_PAGE}
          component={ProPromotionLotPage}
        />
        <Route
          path={ROUTES.PRO_PROMOTION_USERS_PAGE}
          component={ProPromotionUsersPage}
        />
        <Route path={ROUTES.PRO_PROMOTION_PAGE} component={ProPromotionPage} />
        <Route
          path={ROUTES.PRO_ORGANISATION_PAGE}
          component={ProOrganisationPage}
        />
        <Route path={ROUTES.PRO_REVENUES_PAGE} component={ProRevenuesPage} />
        <Route path={ROUTES.ACCOUNT_PAGE} component={AccountPage} />
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
        <Route
          exact
          path={ROUTES.PRO_DASHBOARD_PAGE}
          component={ProDashboardPage}
        />
        <Route exact path={IMPERSONATE_ROUTE} component={ImpersonatePage} />
        <Route component={NotFound} />
      </Switch>
    </ProLayout>
  </BaseRouter>
);

export default ProRouter;
