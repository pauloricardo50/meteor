import React from 'react';
import PropTypes from 'prop-types';
import { StaticRouter } from 'react-router';
import { Provider } from 'react-redux';

import Routes from '../shared/Routes';

const ServerApp = ({ store, context, location }) => (
  <Provider store={store}>
    <StaticRouter location={location} context={context}>
      <Routes />
    </StaticRouter>
  </Provider>
);

ServerApp.propTypes = {
  store: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default ServerApp;
