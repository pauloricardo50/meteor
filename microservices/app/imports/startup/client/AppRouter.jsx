import React from 'react';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';

import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from '../../../lang/fr.json';
import AppStore from '../../ui/components/AppStore';

import LoanContainer from 'core/containers/LoanContainer';

import DevPage from 'core/components/DevPage';
import DashboardPage from '../../ui/pages/DashboardPage';
import BorrowerPage from '../../ui/pages/BorrowerPage';
import PropertyPage from '../../ui/pages/PropertyPage';
import AuctionPage from '../../ui/pages/AuctionPage';
import StrategyPage from '../../ui/pages/StrategyPage';
import OfferPickerPage from '../../ui/pages/OfferPickerPage';
import StructurePage from '../../ui/pages/StructurePage';
import VerificationPage from '../../ui/pages/VerificationPage';
import ContractPage from '../../ui/pages/ContractPage';
import ClosingPage from '../../ui/pages/ClosingPage';
import FinancePage from '../../ui/pages/FinancePage';
import FilesPage from '../../ui/pages/FilesPage';

import ComparePage from '../../ui/pages/ComparePage';
import AppPage from '../../ui/pages/AppPage';
import AccountPage from '../../ui/pages/AccountPage';
import AddLoanPage from '../../ui/pages/AddLoanPage';
import PasswordResetpage from '../../ui/pages/PasswordResetPage';

import AppLayout from '../../ui/layouts/AppLayout';

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
          path="/loans/:loanId/borrowers/:borrowerId"
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
        <Route path="/compare" component={ComparePage} />
        <Route path="/add-loan/:loanId" component={AddLoanPage} />
        <Route path="/enroll-account/:token" component={PasswordResetpage} />
        <Route exact path="/" component={AppPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  </BaseRouter>
);

export default AppRouter;
