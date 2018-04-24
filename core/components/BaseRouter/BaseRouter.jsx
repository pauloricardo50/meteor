import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';

import togglePoint, { TOGGLE_POINTS } from 'core/api/features/togglePoint';

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
        <Router>
          {/* Every route change should scroll to top,
              which isn't automatic */}
          <ScrollToTop>
            <Switch>
              {/* LoginPage has to be above / path */}
              {togglePoint({
                id: TOGGLE_POINTS.LITE_VERSION_LOGIN_OFF,
                code: hasLogin,
              }) && <Route exact path="/login" component={LoginPage} />}
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
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
  formats: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  hasLogin: PropTypes.bool,
};

BaseRouter.defaultProps = {
  WrapperComponent: React.Fragment,
  hasLogin: true,
};

export default BaseRouter;
