import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import createTheme from 'core/config/muiCustom';

const MaterialUiClient = ({ children }) => {
  useEffect(() => {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <MuiThemeProvider theme={createTheme({ fontSize: 16 })}>
      {children}
    </MuiThemeProvider>
  );
};

MaterialUiClient.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MaterialUiClient;
