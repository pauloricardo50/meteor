import React, { Component } from 'react';
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
import { getUserLocale, getTranslations, getFormats } from '../../localization';

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
  <MuiThemeProvider theme={theme}>
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
            <Route
              path="/partner"
              render={props => <PartnerRoutes {...props} />}
            />
            <Route exact path="/" component={PasswordPage} />
            <Route path="/" render={props => <PublicRoutes {...props} />} />
          </Switch>
        </ScrollToTopWithRouter>
      </Router>
    </IntlProvider>
  </MuiThemeProvider>
);

export default RenderRoutes;
