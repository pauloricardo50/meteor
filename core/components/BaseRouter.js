import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import MuiTheme from '../mui_custom';
import Loadable from '../utils/loadable';
import ErrorBoundary from './ErrorBoundary';
import ScrollToTop from './ScrollToTop';

const BaseRouter = ({ locale, messages, formats, children }) => (
  <ErrorBoundary helper="root">
    {/* Inject custom material-ui theme for everything to look good */}
    <MuiThemeProvider theme={theme}>
      {/* Inject Intl props to all components to render the proper locale */}
      <IntlProvider
        locale={locale}
        messages={messages}
        formats={formats}
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
              <Switch>{children}</Switch>
            </ScrollToTopWithRouter>
          </Router>
        </ErrorBoundary>
      </IntlProvider>
    </MuiThemeProvider>
  </ErrorBoundary>
);

export default BaseRouter;
