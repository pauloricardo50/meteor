import React from 'react';
import PropTypes from 'prop-types';
import { StaticRouter } from 'react-router';

import App from '../shared/App';

const ServerApp = ({ context, location, ...otherProps }) => (
  <App
    Router={routerProps =>
      <StaticRouter context={context} location={location} {...routerProps} />
    }
    {...otherProps}
  />
);

ServerApp.propTypes = {
  context: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default ServerApp;
