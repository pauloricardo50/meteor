import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';

import myTheme from '/imports/js/config/mui_custom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { IntlProvider } from 'react-intl';
import { getUserLocale, getTranslations, getFormats } from '../localization';

import Loadable from '/imports/js/helpers/loadable';
import PasswordPage from '/imports/ui/pages/public/PasswordPage.jsx';

// import PublicRoutes from './routes/PublicRoutes.jsx';
// import UserRoutes from './routes/UserRoutes.jsx';
// import AdminRoutes from './routes/AdminRoutes.jsx';
// import PartnerRoutes from './routes/PartnerRoutes.jsx';


const PublicRoutes = Loadable({ loader: () => import('./routes/PublicRoutes.jsx') });
const UserRoutes = Loadable({ loader: () => import('./routes/UserRoutes.jsx') });
const AdminRoutes = Loadable({ loader: () => import('./routes/AdminRoutes.jsx') });
const PartnerRoutes = Loadable({ loader: () => import('./routes/PartnerRoutes.jsx') });


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

const RenderRoutes = () =>
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
  </MuiThemeProvider>;

export default RenderRoutes;
