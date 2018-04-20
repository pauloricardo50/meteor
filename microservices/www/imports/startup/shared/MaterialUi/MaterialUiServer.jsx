import React from 'react';
import PropTypes from 'prop-types';
import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from 'core/config/muiCustom';

const MaterialUiServer = ({ children, registry, generateClassName }) => (
  <JssProvider registry={registry} generateClassName={generateClassName}>
    <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
      {children}
    </MuiThemeProvider>
  </JssProvider>
);

MaterialUiServer.propTypes = {
  children: PropTypes.node.isRequired,
  registry: PropTypes.object.isRequired,
  generateClassName: PropTypes.func.isRequired,
};
export default MaterialUiServer;
