import React from 'react';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';

import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from '../../../lang/fr.json';
import AppStore from '../../client/components/AppStore';

import LoanContainer from 'core/containers/LoanContainer';

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

const AppRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    WrapperComponent={AppStore}
  >
    <AppLayout type="app">
      <Switch>
        <Route path="/dev" component={DevPage} />
        <Route path="/profile" component={AccountPage} />
        <Route
          path="/loans/:loanId/borrowers/:borrowerId/:tab"
          component={LoanContainer(BorrowerPage)}
        />
        <Route
          path="/loans/:loanId/property"
          component={LoanContainer(PropertyPage)}
        />
        <Route
          path="/loans/:loanId/finance"
          component={LoanContainer(FinancePage)}
        />
        <Route
          path="/loans/:loanId/verification"
          component={LoanContainer(VerificationPage)}
        />
        <Route
          path="/loans/:loanId/structure"
          component={LoanContainer(StructurePage)}
        />
        <Route
          path="/loans/:loanId/auction"
          component={LoanContainer(AuctionPage)}
        />
        <Route
          path="/loans/:loanId/strategy"
          component={LoanContainer(StrategyPage)}
        />
        <Route
          path="/loans/:loanId/offerpicker"
          component={LoanContainer(OfferPickerPage)}
        />
        <Route
          path="/loans/:loanId/contract"
          component={LoanContainer(ContractPage)}
        />
        <Route
          path="/loans/:loanId/closing"
          component={LoanContainer(ClosingPage)}
        />
        <Route
          path="/loans/:loanId/files"
          component={LoanContainer(FilesPage)}
        />
        <Route path="/loans/:loanId" component={LoanContainer(DashboardPage)} />
        <Route path="/add-loan/:loanId" component={AddLoanPage} />
        <Route path="/reset-password/:token" component={PasswordResetPage} />
        <Route path="/enroll-account/:token" component={PasswordResetpage} />
        <Route path="/verify-email/:token" component={EmailVerificationPage} />
        <Route exact path="/" component={AppPage} />
        <Route exact path={IMPERSONATE_ROUTE} component={ImpersonatePage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  </BaseRouter>
);

export default AppRouter;
