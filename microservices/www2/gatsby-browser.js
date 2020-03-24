import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

import createTheme from './src/core/config/muiCustom';
import Layout from './src/components/Layout';
import meteorClient, { MeteorClientContext } from './src/utils/meteorClient';

import './src/styles/main.scss';

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
