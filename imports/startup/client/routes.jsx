import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';

import myTheme from '/imports/js/config/mui_custom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { IntlProvider } from 'react-intl';
import { getUserLocale, getTranslations, getFormats } from './localization';

// Layouts
import { PublicLayout } from '/imports/ui/containers/PublicContainers';
import { UserLayout } from '/imports/ui/containers/UserContainers';
import { AdminLayout } from '/imports/ui/containers/AdminContainers';
import { PartnerLayout } from '/imports/ui/containers/PartnerContainers';

// Public pages
import PasswordPage from '/imports/ui/pages/public/PasswordPage.jsx';
import HomePage from '/imports/ui/pages/public/HomePage.jsx';
import Start1Page from '/imports/ui/pages/public/Start1Page.jsx';
import { Start2Page } from '/imports/ui/containers/PublicContainers';
import LoginPage from '/imports/ui/pages/public/LoginPage.jsx';
import AboutPage from '/imports/ui/pages/public/AboutPage.jsx';
import CareersPage from '/imports/ui/pages/public/CareersPage.jsx';
import TosPage from '/imports/ui/pages/public/TosPage.jsx';
import EmailVerificationPage from '/imports/ui/pages/public/EmailVerificationPage.jsx';

// User pages
// import DashBoardPage from '/imports/ui/pages/user/DashboardPage.jsx';
import AccountPage from '/imports/ui/pages/user/AccountPage.jsx';
import {
  DashboardPage,
  BorrowerPage,
  PropertyPage,
  AuctionPage,
  LenderPickerPage,
  StructurePage,
  VerificationPage,
  ExpertisePage,
  FinalStepsPage,
  DevPage,
} from '/imports/ui/containers/UserContainers';
import ContactPage from '/imports/ui/pages/user/ContactPage.jsx';
import NewPage from '/imports/ui/pages/user/NewPage.jsx';

// Admin pages
import AdminDashboardPage from '/imports/ui/pages/admin/AdminDashboardPage.jsx';
import UsersPage from '/imports/ui/pages/admin/UsersPage.jsx';
import RequestsPage from '/imports/ui/pages/admin/RequestsPage.jsx';
import {
  OfferPage,
  SingleRequestPage,
  SingleUserPage,
  VerifyPage,
  ContactLendersPage,
} from '/imports/ui/containers/AdminContainers';
import AdminDevPage from '/imports/ui/pages/admin/AdminDevPage.jsx';

// Partner pages
import PartnerHomePage from '/imports/ui/pages/partner/PartnerHomePage.jsx';
import PartnerRequestPage from '/imports/ui/pages/partner/PartnerRequestPage.jsx';

import TestPage from '/imports/ui/pages/public/TestPage.jsx';

const PublicRoutes = props => (
  <PublicLayout {...props}>
    <Switch>
      <Route path="/home" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/start1/:type" component={Start1Page} />
      <Route path="/start2/:type" component={Start2Page} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/tos" component={TosPage} />
      <Route path="/test" component={TestPage} />
      <Route path="/verify-email/:token" component={EmailVerificationPage} />
    </Switch>
  </PublicLayout>
);

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
        <Route path="/app/requests/:requestId/borrowers/:borrowerId" component={BorrowerPage} />
        <Route path="/app/requests/:requestId/property" component={PropertyPage} />
        <Route path="/app/requests/:requestId/verification" component={VerificationPage} />
        <Route path="/app/requests/:requestId/expertise" component={ExpertisePage} />
        <Route path="/app/requests/:requestId/auction" component={AuctionPage} />
        <Route path="/app/requests/:requestId/structure" component={StructurePage} />
        <Route path="/app/requests/:requestId/lenderpicker" component={LenderPickerPage} />
        <Route path="/app/requests/:requestId/finalsteps" component={FinalStepsPage} />
        <Route path="/app/requests/:requestId" component={DashboardPage} name="asdf" />
        <Route path="/app" render={routeProps => <NewPage {...layoutProps} {...routeProps} />} />
      </Switch>
    )}
  />
);

const AdminRoutes = props => (
  <AdminLayout
    {...props}
    type="admin"
    render={layoutProps => (
      <Switch>
        <Route exact path="/admin" render={() => <AdminDashboardPage {...layoutProps} />} />
        <Route exact path="/admin/users" render={() => <UsersPage {...layoutProps} />} />
        <Route exact path="/admin/requests" render={() => <RequestsPage {...layoutProps} />} />
        <Route path="/admin/requests/:requestId/verify" component={VerifyPage} />
        <Route path="/admin/requests/:requestId/contactlenders" component={ContactLendersPage} />
        <Route path="/admin/requests/:requestId/offers/:offerId" component={OfferPage} />
        <Route path="/admin/requests/:requestId" component={SingleRequestPage} />
        <Route path="/admin/users/:userId" component={SingleUserPage} />
        <Route exact path="/admin/dev" render={() => <AdminDevPage {...layoutProps} />} />
      </Switch>
    )}
  />
);

const PartnerRoutes = props => (
  <PartnerLayout
    {...props}
    type="partner"
    render={layoutProps => (
      <Switch>
        <Route exact path="/partner" render={() => <PartnerHomePage {...layoutProps} />} />
        <Route
          exact
          path="/partner/requests/:requestId"
          render={routeProps => <PartnerRequestPage {...layoutProps} {...routeProps} />}
        />
      </Switch>
    )}
  />
);

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

const ScrollToTopWithRouter = withRouter(ScrollToTop);

const RenderRoutes = () => (
  <MuiThemeProvider muiTheme={getMuiTheme(myTheme)}>
    <IntlProvider
      locale={getUserLocale()}
      messages={getTranslations()}
      formats={getFormats()}
      defaultLocale="fr"
      // key={getUserLocale()} Use this if the app doesn't reload on locale change
    >
      <Router>
        <ScrollToTopWithRouter>
          <Switch>
            <Route path="/app" render={props => <UserRoutes {...props} />} />
            <Route path="/admin" render={props => <AdminRoutes {...props} />} />
            <Route path="/partner" render={props => <PartnerRoutes {...props} />} />
            <Route exact path="/" component={PasswordPage} />
            <Route path="/" render={props => <PublicRoutes {...props} />} />
          </Switch>
        </ScrollToTopWithRouter>
      </Router>
    </IntlProvider>
  </MuiThemeProvider>
);

export default RenderRoutes;
