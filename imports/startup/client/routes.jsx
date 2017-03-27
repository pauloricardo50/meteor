import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import myTheme from '/imports/js/config/mui_custom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Layouts
import { PublicLayout } from '/imports/ui/containers/PublicContainers';
import { UserLayout } from '/imports/ui/containers/UserContainers';
import { AdminLayout } from '/imports/ui/containers/AdminContainers';
import { PartnerLayout } from '/imports/ui/containers/PartnerContainers';

// Public pages
import HomePage from '/imports/ui/pages/public/HomePage.jsx';
import Start1Page from '/imports/ui/pages/public/Start1Page.jsx';
import { Start2Page } from '/imports/ui/containers/PublicContainers';
import LoginPage from '/imports/ui/pages/public/LoginPage.jsx';
import AboutPage from '/imports/ui/pages/public/AboutPage.jsx';
import CareersPage from '/imports/ui/pages/public/CareersPage.jsx';
import TosPage from '/imports/ui/pages/public/TosPage.jsx';

// User pages
import DashBoardPage from '/imports/ui/pages/user/DashboardPage.jsx';
import InformationPage from '/imports/ui/pages/user/InformationPage.jsx';
import ProfilePage from '/imports/ui/pages/user/ProfilePage.jsx';
import {
  BorrowerPage,
  RequestPage,
  PropertyPage,
} from '/imports/ui/containers/UserContainers';
import ContactPage from '/imports/ui/pages/user/ContactPage.jsx';
import NewPage from '/imports/ui/pages/user/NewPage.jsx';

// Admin pages
import AdminHomePage from '/imports/ui/pages/admin/AdminHomePage.jsx';
import AdminUsersPage from '/imports/ui/pages/admin/AdminUsersPage.jsx';
import AdminRequestsPage from '/imports/ui/pages/admin/AdminRequestsPage.jsx';
import AdminOfferPage from '/imports/ui/pages/admin/AdminOfferPage.jsx';
import AdminSingleRequestPage
  from '/imports/ui/pages/admin/AdminSingleRequestPage.jsx';
import AdminSingleUserPage
  from '/imports/ui/pages/admin/AdminSingleUserPage.jsx';

// Partner pages
import PartnerHomePage from '/imports/ui/pages/partner/PartnerHomePage.jsx';
import PartnerRequestPage
  from '/imports/ui/pages/partner/PartnerRequestPage.jsx';

const PublicRoutes = props => (
  <PublicLayout {...props}>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/start1/:type" component={Start1Page} />
      <Route path="/start2/:type" component={Start2Page} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/tos" component={TosPage} />
    </Switch>
  </PublicLayout>
);

const UserRoutes = props => (
  <UserLayout
    {...props}
    type="user"
    render={layoutProps => (
      <Switch>

        <Route
          exact
          path="/app/new/:requestId"
          render={routeProps => <NewPage {...layoutProps} {...routeProps} />}
        />
        <Route
          path="/app/me"
          render={() => <InformationPage {...layoutProps} />}
        />
        <Route
          path="/app/profile"
          render={() => <ProfilePage {...layoutProps} />}
        />
        <Route
          path="/app/contact"
          render={() => <ContactPage {...layoutProps} />}
        />
        <Route path="/app/borrowers/:borrowerId" component={BorrowerPage} />
        <Route path="/app/requests/:requestId" component={RequestPage} />
        <Route
          path="/app/requests/:requestId/property"
          component={PropertyPage}
        />

        <Route path="/app" render={() => <DashBoardPage {...layoutProps} />} />
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
        <Route
          exact
          path="/admin"
          render={() => <AdminHomePage {...layoutProps} />}
        />
        <Route
          exact
          path="/admin/users"
          render={() => <AdminUsersPage {...layoutProps} />}
        />
        <Route
          exact
          path="/admin/requests"
          render={() => <AdminRequestsPage {...layoutProps} />}
        />
        <Route
          path="/admin/requests/:requestId"
          render={routeProps => (
            <AdminSingleRequestPage {...layoutProps} {...routeProps} />
          )}
        />
        <Route
          path="/admin/users/:userId"
          render={routeProps => (
            <AdminSingleUserPage {...layoutProps} {...routeProps} />
          )}
        />
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
        <Route
          exact
          path="/partner"
          render={() => <PartnerHomePage {...layoutProps} />}
        />
        <Route
          exact
          path="/partner/requests/:requestId"
          render={routeProps => (
            <PartnerRequestPage {...layoutProps} {...routeProps} />
          )}
        />
      </Switch>
    )}
  />
);

const RenderRoutes = () => (
  <MuiThemeProvider muiTheme={getMuiTheme(myTheme)}>
    <Router>
      <Switch>
        <Route path="/app" render={props => <UserRoutes {...props} />} />
        <Route path="/admin" render={props => <AdminRoutes {...props} />} />
        <Route path="/partner" render={props => <PartnerRoutes {...props} />} />
        <Route path="/" render={props => <PublicRoutes {...props} />} />
      </Switch>
    </Router>
  </MuiThemeProvider>
);

export default RenderRoutes;
