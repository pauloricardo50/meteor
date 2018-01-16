import React from 'react';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';

import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from '../../../lang/fr.json';
import AppStore from '../../ui/components/AppStore';

import RequestContainer from 'core/containers/RequestContainer';

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

import DevPage from '../../ui/pages/DevPage';
import ComparePage from '../../ui/pages/ComparePage';
import AppPage from '../../ui/pages/AppPage';
import AccountPage from '../../ui/pages/AccountPage';
import AddRequestPage from '../../ui/pages/AddRequestPage';
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
          path="/requests/:requestId/borrowers/:borrowerId/:tab"
          component={RequestContainer(BorrowerPage)}
        />
        <Route
          path="/requests/:requestId/property"
          component={RequestContainer(PropertyPage)}
        />
        <Route
          path="/requests/:requestId/finance"
          component={RequestContainer(FinancePage)}
        />
        <Route
          path="/requests/:requestId/verification"
          component={RequestContainer(VerificationPage)}
        />
        <Route
          path="/requests/:requestId/structure"
          component={RequestContainer(StructurePage)}
        />
        <Route
          path="/requests/:requestId/auction"
          component={RequestContainer(AuctionPage)}
        />
        <Route
          path="/requests/:requestId/strategy"
          component={RequestContainer(StrategyPage)}
        />
        <Route
          path="/requests/:requestId/offerpicker"
          component={RequestContainer(OfferPickerPage)}
        />
        <Route
          path="/requests/:requestId/contract"
          component={RequestContainer(ContractPage)}
        />
        <Route
          path="/requests/:requestId/closing"
          component={RequestContainer(ClosingPage)}
        />
        <Route
          path="/requests/:requestId/files"
          component={RequestContainer(FilesPage)}
        />
        <Route
          path="/requests/:requestId"
          component={RequestContainer(DashboardPage)}
        />
        <Route path="/compare" component={ComparePage} />
        <Route path="/add-request/:requestId" component={AddRequestPage} />
        <Route path="/enroll-account/:token" component={PasswordResetpage} />
        <Route exact path="/" component={AppPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  </BaseRouter>
);

export default AppRouter;
