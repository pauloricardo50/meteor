import React from 'react';
import { Route, Switch } from 'react-router-dom';

import BaseRouter from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';

import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from '../../../lang/fr.json';

import {
  UserLayout,
  DashboardPage,
  BorrowerPage,
  PropertyPage,
  AuctionPage,
  StrategyPage,
  OfferPickerPage,
  StructurePage,
  VerificationPage,
  ContractPage,
  ClosingPage,
  DevPage,
  FinancePage,
  ComparePage,
  AppPage,
  FilesPage,
} from 'core/containers/UserContainers';
import AccountPage from '../../ui/pages/AccountPage';
import AddRequestPage from '../../ui/pages/AddRequestPage';
import PasswordResetpage from '../../ui/pages/PasswordResetPage';

const AppRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
  >
    <UserLayout
      type="app"
      render={layoutProps => (
        <Switch>
          <Route path="/dev" component={DevPage} />
          <Route
            path="/profile"
            render={() => <AccountPage {...layoutProps} />}
          />
          <Route
            path="/requests/:requestId/borrowers/:borrowerId/:tab"
            component={BorrowerPage}
          />
          <Route
            path="/requests/:requestId/property"
            component={PropertyPage}
          />
          <Route path="/requests/:requestId/finance" component={FinancePage} />
          <Route
            path="/requests/:requestId/verification"
            component={VerificationPage}
          />
          <Route
            path="/requests/:requestId/structure"
            component={StructurePage}
          />
          <Route path="/requests/:requestId/auction" component={AuctionPage} />
          <Route
            path="/requests/:requestId/strategy"
            component={StrategyPage}
          />
          <Route
            path="/requests/:requestId/offerpicker"
            component={OfferPickerPage}
          />
          <Route
            path="/requests/:requestId/contract"
            component={ContractPage}
          />
          <Route path="/requests/:requestId/closing" component={ClosingPage} />
          <Route path="/requests/:requestId/files" component={FilesPage} />
          <Route path="/requests/:requestId" component={DashboardPage} />
          <Route path="/compare" component={ComparePage} />
          <Route path="/add-request/:requestId" component={AddRequestPage} />
          <Route path="/enroll-account/:token" component={PasswordResetpage} />
          <Route exact path="/" component={AppPage} />
          <Route component={NotFound} />
        </Switch>
      )}
    />
  </BaseRouter>
);

export default AppRouter;
