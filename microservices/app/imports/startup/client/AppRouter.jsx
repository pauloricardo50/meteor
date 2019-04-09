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
import messagesFR from '../../../lang/fr.json';
import AppStore from '../../client/components/AppStore';
import AppAccountPage from '../../client/pages/AppAccountPage';
import AppWidget1Page from '../../client/pages/AppWidget1Page';
import AppPage from '../../client/pages/AppPage';
import BorrowersPage from '../../client/pages/BorrowersPage';
import DashboardPage from '../../client/pages/DashboardPage';
import FilesPage from '../../client/pages/FilesPage';
import FinancingPage from '../../client/pages/FinancingPage';
import RefinancingPage from '../../client/pages/RefinancingPage';
import PropertiesPage from '../../client/pages/PropertiesPage';
import SinglePropertyPage from '../../client/pages/SinglePropertyPage';
import AppLayout from '../../client/layouts/AppLayout';
import AppPromotionPage from '../../client/pages/AppPromotionPage';
import AppPromotionOptionPage from '../../client/pages/AppPromotionOptionPage';
import AppPromotionLotPage from '../../client/pages/AppPromotionLotPage';
import WelcomePage from '../../client/pages/WelcomePage';
import SolvencyPage from '../../client/pages/SolvencyPage';

import * as ROUTES from './appRoutes';

const AppRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    WrapperComponent={AppStore}
  >
    <AppLayout>
      <Switch>
        <Route path={ROUTES.REFINANCING_PAGE} component={RefinancingPage} />
        <Route path={ROUTES.ACCOUNT_PAGE} component={AppAccountPage} />
        <Route path={ROUTES.APP_WIDGET1_PAGE} component={AppWidget1Page} />
        {/* Keep BORROWERS_PAGE above BORROWERS_PAGE_NO_TAB */}
        <Route path={ROUTES.BORROWERS_PAGE} component={BorrowersPage} />
        <Route path={ROUTES.BORROWERS_PAGE_NO_TAB} component={BorrowersPage} />
        <Route path={ROUTES.DEV_PAGE} component={DevPage} />
        <Route path={ROUTES.FILES_PAGE} component={FilesPage} />
        <Route path={ROUTES.FINANCING_PAGE} component={FinancingPage} />
        <Route path={ROUTES.PROPERTY_PAGE} component={SinglePropertyPage} />
        <Route path={ROUTES.PROPERTIES_PAGE} component={PropertiesPage} />
        <Route
          path={ROUTES.APP_PROMOTION_LOT_PAGE}
          component={AppPromotionLotPage}
        />
        <Route
          path={ROUTES.APP_PROMOTION_OPTION_PAGE}
          component={AppPromotionOptionPage}
        />
        <Route path={ROUTES.APP_PROMOTION_PAGE} component={AppPromotionPage} />
        <Route path={ROUTES.WELCOME_PAGE} component={WelcomePage} />
        <Route path={ROUTES.SOLVENCY_PAGE} component={SolvencyPage} />
        <Route path={ROUTES.DASHBOARD_PAGE} component={DashboardPage} />
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
        <Route exact path={ROUTES.APP_PAGE} component={AppPage} />
        <Route exact path={IMPERSONATE_ROUTE} component={ImpersonatePage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  </BaseRouter>
);

export default AppRouter;
