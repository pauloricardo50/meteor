import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AccountPage from '/imports/ui/pages/user/AccountPage';
import {
  UserLayout,
  DashboardPage,
  BorrowerPage,
  PropertyPage,
  AuctionPage,
  StrategyPage,
  LenderPickerPage,
  StructurePage,
  VerificationPage,
  ContractPage,
  ClosingPage,
  DevPage,
  FinancePage,
  ComparePage,
  AppPage,
} from '/imports/ui/containers/UserContainers';
import NotFound from '/imports/ui/components/general/NotFound';

const UserRoutes = props => (
  <UserLayout
    {...props}
    type="user"
    render={layoutProps => (
      <Switch>
        <Route path="/app/dev" component={DevPage} />
        <Route
          path="/app/profile"
          render={() => <AccountPage {...layoutProps} />}
        />
        <Route
          path="/app/requests/:requestId/borrowers/:borrowerId/:tab"
          component={BorrowerPage}
        />
        <Route
          path="/app/requests/:requestId/property"
          component={PropertyPage}
        />
        <Route
          path="/app/requests/:requestId/finance"
          component={FinancePage}
        />
        <Route
          path="/app/requests/:requestId/verification"
          component={VerificationPage}
        />
        <Route
          path="/app/requests/:requestId/structure"
          component={StructurePage}
        />
        <Route
          path="/app/requests/:requestId/auction"
          component={AuctionPage}
        />
        <Route
          path="/app/requests/:requestId/strategy"
          component={StrategyPage}
        />
        <Route
          path="/app/requests/:requestId/lenderpicker"
          component={LenderPickerPage}
        />
        <Route
          path="/app/requests/:requestId/contract"
          component={ContractPage}
        />
        <Route
          path="/app/requests/:requestId/closing"
          component={ClosingPage}
        />
        <Route path="/app/requests/:requestId" component={DashboardPage} />
        <Route path="/app/compare" component={ComparePage} />
        <Route path="/app" component={AppPage} />
        <Route component={NotFound} />
      </Switch>
    )}
  />
);

export default UserRoutes;
