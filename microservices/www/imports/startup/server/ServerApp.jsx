import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { StaticRouter } from 'react-router';

import createTheme from 'core/config/muiCustom';

import App from '../shared/App';

const ServerApp = ({ context, location, ...otherProps }) => (
  <MuiThemeProvider theme={createTheme({ fontSize: 16 })}>
    <App
      Router={routerProps => (
        <StaticRouter context={context} location={location} {...routerProps} />
      )}
      {...otherProps}
    />
  </MuiThemeProvider>
);

ServerApp.propTypes = {
  context: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default ServerApp;
