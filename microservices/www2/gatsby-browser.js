import './src/styles/main.scss';

import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

import Layout from './src/components/Layout';
import createTheme from './src/core/config/muiCustom';
import meteorClient, { MeteorClientContext } from './src/utils/meteorClient';

const wrapPageElement = ({ element, props }) => (
  <Layout {...props}>{element}</Layout>
);

const theme = createTheme({ fontSize: 18 });

const wrapRootElement = ({ element }) => (
  <MeteorClientContext.Provider value={meteorClient}>
    <MuiThemeProvider theme={theme}>{element}</MuiThemeProvider>
  </MeteorClientContext.Provider>
);

export { wrapPageElement, wrapRootElement };

// Use this variable in core if needed
window.GATSBY = true;
