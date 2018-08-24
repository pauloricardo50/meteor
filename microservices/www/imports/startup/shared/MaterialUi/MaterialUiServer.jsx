import React from 'react';
import PropTypes from 'prop-types';
import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider } from '@material-ui/core/styles';
import createTheme from 'core/config/muiCustom';

const MaterialUiServer = ({ children, registry, generateClassName }) => (
  <JssProvider registry={registry} generateClassName={generateClassName}>
    <MuiThemeProvider theme={createTheme()} sheetsManager={new Map()}>
      {children}
    </MuiThemeProvider>
  </JssProvider>
);

MaterialUiServer.propTypes = {
  children: PropTypes.node.isRequired,
  generateClassName: PropTypes.func.isRequired,
  registry: PropTypes.object.isRequired,
};
export default MaterialUiServer;
