import React from 'react';
import PropTypes from 'prop-types';
import { StaticRouter } from 'react-router';

import App from '../shared/App';

const ServerApp = ({ store, context, location }) => (
  <App
    store={store}
    Router={routerProps => (
      <StaticRouter context={context} location={location} {...routerProps} />
    )}
  />
);

ServerApp.propTypes = {
  store: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default ServerApp;
