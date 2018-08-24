import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'react-router-dom';

import history from 'core/utils/history';

import ErrorBoundary from '../ErrorBoundary';
import ScrollToTop from '../ScrollToTop';
import LoginPage from '../LoginPage';

import Switch from './Switch';
import Route from './Route';
import LibraryWrappers from './LibraryWrappers';

const BaseRouter = ({
  locale,
  messages,
  formats,
  children,
  WrapperComponent,
  hasLogin,
}) => (
  <ErrorBoundary helper="root">
    <LibraryWrappers
      i18n={{ locale, messages, formats }}
      WrapperComponent={WrapperComponent}
    >
      {/* Make sure all errors are catched in the top-level of the app
        can't put it higher up, because it needs
        react-intl to display messages */}
      <ErrorBoundary helper="app">
        <Router history={history}>
          {/* Every route change should scroll to top,
              which isn't automatic */}
          <ScrollToTop>
            <Switch>
              {/* LoginPage has to be above / path */}
              {hasLogin && <Route exact path="/login" component={LoginPage} />}
              <Route
                path="/"
                render={childProps => React.cloneElement(children, childProps)}
              />
            </Switch>
          </ScrollToTop>
        </Router>
      </ErrorBoundary>
    </LibraryWrappers>
  </ErrorBoundary>
);

BaseRouter.propTypes = {
  children: PropTypes.node.isRequired,
  formats: PropTypes.object.isRequired,
  hasLogin: PropTypes.bool,
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
  WrapperComponent: PropTypes.any,
};

BaseRouter.defaultProps = {
  WrapperComponent: React.Fragment,
  hasLogin: true,
};

export default BaseRouter;
