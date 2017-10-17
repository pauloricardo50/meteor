import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '/imports/js/config/mui_custom';
import Loadable from '/imports/js/helpers/loadable';
import { PasswordPage } from '/imports/ui/containers/PublicContainers';
import ErrorBoundary from '/imports/ui/components/general/ErrorBoundary';
import { getUserLocale, getTranslations, getFormats } from '../../localization';
import ScrollToTop from './ScrollToTop';

// import PublicRoutes from './PublicRoutes';
// import UserRoutes from './UserRoutes';
// import AdminRoutes from './AdminRoutes';
// import PartnerRoutes from './PartnerRoutes';

const PublicRoutes = Loadable({
  loader: () => import('./PublicRoutes'),
});
const UserRoutes = Loadable({
  loader: () => import('./UserRoutes'),
});
const AdminRoutes = Loadable({
  loader: () => import('./AdminRoutes'),
});
const PartnerRoutes = Loadable({
  loader: () => import('./PartnerRoutes'),
});

const ScrollToTopWithRouter = withRouter(ScrollToTop);

const RenderRoutes = () => (
  <ErrorBoundary helper="root">
    {/* Inject custom material-ui theme for everything to look good */}
    <MuiThemeProvider theme={theme}>
      {/* Inject Intl props to all components to render the proper locale */}
      <IntlProvider
        locale={getUserLocale()}
        messages={getTranslations()}
        formats={getFormats()}
        defaultLocale="fr"
        // key={getUserLocale()} Use this if the app doesn't reload on locale change
      >
        {/* Make sure all errors are catched in the top-level of the app
        can't put it higher up, because it needs
        react-intl to display messages */}
        <ErrorBoundary helper="app">
          <Router>
            {/* Every route change should scroll to top, which isn't automatic */}
            <ScrollToTopWithRouter>
              <Switch>
                <Route
                  path="/app"
                  render={props => <UserRoutes {...props} />}
                />
                <Route
                  path="/admin"
                  render={props => <AdminRoutes {...props} />}
                />
                <Route
                  path="/partner"
                  render={props => <PartnerRoutes {...props} />}
                />
                <Route exact path="/" component={PasswordPage} />
                <Route path="/" render={props => <PublicRoutes {...props} />} />
              </Switch>
            </ScrollToTopWithRouter>
          </Router>
        </ErrorBoundary>
      </IntlProvider>
    </MuiThemeProvider>
  </ErrorBoundary>
);

export default RenderRoutes;
