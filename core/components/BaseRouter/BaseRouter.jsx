import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'react-router-dom';

import { InjectCurrentUser } from '../../containers/CurrentUserContext';
import history from '../../utils/history';
import DisconnectNotification from '../DisconnectNotification';
import ErrorBoundary from '../ErrorBoundary';
import LoginPage from '../LoginPage/loadable';
import MicroserviceHead from '../MicroserviceHead';
import ModalManager from '../ModalManager';
import ScrollToTop from '../ScrollToTop';
import GrapherPage from './GrapherPageLoadable';
import HistoryWatcher from './HistoryWatcher';
import LibraryWrappers from './LibraryWrappers';
import Route from './Route';
import Switch from './Switch';

const isDev = process.env.NODE_ENV === 'development';

const loginWithToken = ({
  match: {
    params: { token },
  },
}) => {
  if (token) {
    Meteor.loginWithToken(token, () => history.push('/'));
  } else {
    history.push('/login');
  }

  return null;
};

const BaseRouter = ({
  locale,
  messages,
  formats,
  children,
  WrapperComponent,
  hasLogin,
  routes,
  currentUser,
}) => (
  <ErrorBoundary helper="root">
    <MicroserviceHead />
    <InjectCurrentUser {...currentUser}>
      <LibraryWrappers
        i18n={{ locale, messages, formats }}
        WrapperComponent={WrapperComponent}
      >
        {/* Make sure all errors are catched in the top-level of the app
        can't put it higher up, because it needs
        react-intl to display messages */}
        <ErrorBoundary helper="app">
          <DisconnectNotification />

          <Router history={history}>
            <ModalManager>
              <HistoryWatcher
                history={history}
                routes={{
                  ...routes,
                  LOGIN_PAGE: { path: '/login' },
                  GRAPHER_PAGE: { path: '/grapher' },
                  LOGIN_WITH_TOKEN_PAGE: { path: '/login-token/:token' },
                }}
              >
                <ScrollToTop>
                  <Switch>
                    <Route
                      exact
                      path="/login-token/:token"
                      render={loginWithToken}
                    />
                    {/* LoginPage has to be above / path */}
                    {hasLogin && (
                      <Route exact path="/login" component={LoginPage} />
                    )}
                    {isDev && (
                      <Route exact path="/grapher" component={GrapherPage} />
                    )}
                    <Route
                      path="/"
                      render={childProps =>
                        React.cloneElement(children, childProps)
                      }
                    />
                  </Switch>
                </ScrollToTop>
              </HistoryWatcher>
            </ModalManager>
          </Router>
        </ErrorBoundary>
      </LibraryWrappers>
    </InjectCurrentUser>
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
