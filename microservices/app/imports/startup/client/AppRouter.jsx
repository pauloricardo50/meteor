import React from 'react';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';

import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from '../../../lang/fr.json';
import AppStore from '../../client/components/AppStore';

import DevPage from 'core/components/DevPage';
import DashboardPage from '../../client/pages/DashboardPage';
import BorrowerPage from '../../client/pages/BorrowerPage';
import PropertyPage from '../../client/pages/PropertyPage';
import AuctionPage from '../../client/pages/AuctionPage';
import StrategyPage from '../../client/pages/StrategyPage';
import OfferPickerPage from '../../client/pages/OfferPickerPage';
import StructurePage from '../../client/pages/StructurePage';
import VerificationPage from '../../client/pages/VerificationPage';
import ContractPage from '../../client/pages/ContractPage';
import ClosingPage from '../../client/pages/ClosingPage';
import FinancePage from '../../client/pages/FinancePage';
import FilesPage from '../../client/pages/FilesPage';
import EmailVerificationPage from '../../client/pages/EmailVerificationPage';
import PasswordResetPage from '../../client/pages/PasswordResetPage';

import AppPage from '../../client/pages/AppPage';
import AccountPage from '../../client/pages/AccountPage';
import AddLoanPage from '../../client/pages/AddLoanPage';
import PasswordResetpage from '../../client/pages/PasswordResetPage';

import AppLayout from '../../client/layouts/AppLayout';

// Impersonation
import ImpersonatePage from 'core/components/Impersonate/ImpersonatePage';
import { IMPERSONATE_ROUTE } from 'core/api/impersonation/impersonation';

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
        <Route path={ROUTES.BORROWERS_PAGE} component={BorrowerPage} />
        <Route path={ROUTES.PROPERTIES_PAGE} component={PropertyPage} />
        <Route path={ROUTES.DEV_PAGE} component={FinancePage} />
        <Route path={ROUTES.VERIFICATION_PAGE} component={VerificationPage} />
        <Route path={ROUTES.STRUCTURE_PAGE} component={StructurePage} />
        <Route path={ROUTES.AUCTION_PAGE} component={AuctionPage} />
        <Route path={ROUTES.STRATEGY_PAGE} component={StrategyPage} />
        <Route path={ROUTES.OFFER_PICKER_PAGE} component={OfferPickerPage} />
        <Route path={ROUTES.CONTRACT_PAGE} component={ContractPage} />
        <Route path={ROUTES.CLOSING_PAGE} component={ClosingPage} />
        <Route path={ROUTES.FILES_PAGE} component={FilesPage} />
        <Route path={ROUTES.DASHBOARD_PAGE} component={DashboardPage} />
        <Route path={ROUTES.ADD_LOAN_PAGE} component={AddLoanPage} />
        <Route
          path={ROUTES.PASSWORD_RESET_PAGE}
          component={PasswordResetPage}
        />
        <Route
          path={ROUTES.ENROLL_ACCOUNT_PAGE}
          component={PasswordResetpage}
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
