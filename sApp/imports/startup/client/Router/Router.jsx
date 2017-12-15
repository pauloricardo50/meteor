import React from 'react';
import { Route, Switch } from 'react-router-dom';

import BaseRouter from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';

import { getUserLocale, getTranslations, getFormats } from '../../localization';
import AccountPage from '../../../ui/pages/user/AccountPage';
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
} from '../../../ui/containers/UserContainers';

const Router = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={getTranslations()}
    formats={getFormats()}
  >
    <UserLayout
      type="user"
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
          <Route
            path="/requests/:requestId/finance"
            component={FinancePage}
          />
          <Route
            path="/requests/:requestId/verification"
            component={VerificationPage}
          />
          <Route
            path="/requests/:requestId/structure"
            component={StructurePage}
          />
          <Route
            path="/requests/:requestId/auction"
            component={AuctionPage}
          />
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
          <Route
            path="/requests/:requestId/closing"
            component={ClosingPage}
          />
          <Route path="/requests/:requestId/files" component={FilesPage} />
          <Route path="/requests/:requestId" component={DashboardPage} />
          <Route path="/compare" component={ComparePage} />
          <Route path="/" component={AppPage} />
          <Route component={NotFound} />
        </Switch>
        )}
    />
  </BaseRouter>
);

export default Router;
