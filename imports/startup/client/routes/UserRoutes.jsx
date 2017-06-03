import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AccountPage from '/imports/ui/pages/user/AccountPage.jsx';
import {
  UserLayout,
  DashboardPage,
  BorrowerPage,
  PropertyPage,
  AuctionPage,
  LenderPickerPage,
  StructurePage,
  VerificationPage,
  ExpertisePage,
  ContractPage,
  ClosingPage,
  DevPage,
} from '/imports/ui/containers/UserContainers';
import ContactPage from '/imports/ui/pages/user/ContactPage.jsx';
import NewPage from '/imports/ui/pages/user/NewPage.jsx';

const UserRoutes = props => (
  <UserLayout
    {...props}
    type="user"
    render={layoutProps => (
      <Switch>

        {/* <Route
          exact
          path="/app/new/:requestId"
          render={routeProps => <NewPage {...layoutProps} {...routeProps} />}
        /> */}
        <Route path="/app/dev" component={DevPage} />
        <Route path="/app/profile" render={() => <AccountPage {...layoutProps} />} />
        <Route path="/app/contact" render={() => <ContactPage {...layoutProps} />} />
        <Route
          path="/app/requests/:requestId/borrowers/:borrowerId/:tab"
          component={BorrowerPage}
        />
        <Route path="/app/requests/:requestId/property" component={PropertyPage} />
        <Route path="/app/requests/:requestId/verification" component={VerificationPage} />
        <Route path="/app/requests/:requestId/expertise" component={ExpertisePage} />
        <Route path="/app/requests/:requestId/auction" component={AuctionPage} />
        <Route path="/app/requests/:requestId/structure" component={StructurePage} />
        <Route path="/app/requests/:requestId/lenderpicker" component={LenderPickerPage} />
        <Route path="/app/requests/:requestId/contract" component={ContractPage} />
        <Route path="/app/requests/:requestId/closing" component={ClosingPage} />
        <Route path="/app/requests/:requestId" component={DashboardPage} name="asdf" />
        <Route path="/app" render={routeProps => <NewPage {...layoutProps} {...routeProps} />} />
      </Switch>
    )}
  />
);

export default UserRoutes;
