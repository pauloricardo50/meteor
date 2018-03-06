import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import MuiTheme from '../../config/mui_custom';

import ErrorBoundary from '../ErrorBoundary';
import ScrollToTop from '../ScrollToTop';
import LoginPage from '../LoginPage';

import Switch from './Switch';
import Route from './Route';

const BaseRouter = ({
  locale,
  messages,
  formats,
  children,
  WrapperComponent,
  hasLogin,
}) => (
  <ErrorBoundary helper="root">
    <WrapperComponent>
      {/* Inject custom material-ui theme for everything to look good */}
      <MuiThemeProvider theme={MuiTheme}>
        {/* Inject Intl props to all components to render the proper locale */}
        <IntlProvider
          locale={locale}
          messages={messages}
          formats={formats}
          defaultLocale="fr"
          // key={getUserLocale()} Use this if the app doesn't
          // reload on locale change
        >
          {/* Make sure all errors are catched in the top-level of the app
        can't put it higher up, because it needs
        react-intl to display messages */}
          <ErrorBoundary helper="app">
            <Router>
              {/* Every route change should scroll to top,
              which isn't automatic */}
              <ScrollToTop>
                <Switch>
                  {/* LoginPage has to be above / path */}
                  {hasLogin && (
                    <Route exact path="/login" component={LoginPage} />
                  )}
                  <Route
                    path="/"
                    render={childProps =>
                      React.cloneElement(children, childProps)
                    }
                  />
                </Switch>
              </ScrollToTop>
            </Router>
          </ErrorBoundary>
        </IntlProvider>
      </MuiThemeProvider>
    </WrapperComponent>
  </ErrorBoundary>
);

BaseRouter.propTypes = {
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
  formats: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  WrapperComponent: PropTypes.any,
  hasLogin: PropTypes.bool,
};

BaseRouter.defaultProps = {
  WrapperComponent: React.Fragment,
  hasLogin: true,
};

export default BaseRouter;
