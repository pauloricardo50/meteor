import React from 'react';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';

import { getUserLocale, getFormats } from 'core/utils/localization';
import DevPage from 'core/components/DevPage';
import ImpersonatePage from 'core/components/Impersonate/ImpersonatePage';
import { IMPERSONATE_ROUTE } from 'core/api/impersonation/impersonation';
import messagesFR from '../../../lang/fr.json';
import AppStore from '../../client/components/AppStore';

import AccountPage from '../../client/pages/AccountPage';
import AppPage from '../../client/pages/AppPage';
import BorrowersPage from '../../client/pages/BorrowersPage';
import DashboardPage from '../../client/pages/DashboardPage';
import EmailVerificationPage from '../../client/pages/EmailVerificationPage';
import FilesPage from '../../client/pages/FilesPage';
import FinancingPage from '../../client/pages/FinancingPage';
import PasswordResetPage from '../../client/pages/PasswordResetPage';
import PropertiesPage from '../../client/pages/PropertiesPage';
import SinglePropertyPage from '../../client/pages/SinglePropertyPage';

import AppLayout from '../../client/layouts/AppLayout';

// Impersonation

import * as ROUTES from './appRoutes';

const AppRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    WrapperComponent={AppStore}
  >
    <AppLayout type="app">
      <Switch>
        <Route path={ROUTES.DEV_PAGE} component={DevPage} />
        <Route path={ROUTES.ACCOUNT_PAGE} component={AccountPage} />
        <Route path={ROUTES.BORROWERS_PAGE} component={BorrowersPage} />
        <Route path={ROUTES.BORROWERS_PAGE_NO_TAB} component={BorrowersPage} />
        <Route path={ROUTES.PROPERTY_PAGE} component={SinglePropertyPage} />
        <Route path={ROUTES.PROPERTIES_PAGE} component={PropertiesPage} />
        <Route path={ROUTES.FILES_PAGE} component={FilesPage} />
        <Route path={ROUTES.FINANCING_PAGE} component={FinancingPage} />
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
