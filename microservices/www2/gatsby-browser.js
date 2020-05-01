/* eslint-disable react/jsx-filename-extension */
import './src/styles/main.scss';

import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

import Layout from './src/components/Layout';
import createTheme from './src/core/config/muiCustom';

const theme = createTheme({ fontSize: 18 });

const wrapRootElement = ({ element }) => (
  <MuiThemeProvider theme={theme}>{element}</MuiThemeProvider>
);

export { wrapRootElement };

// Use this variable in core if needed
window.GATSBY = true;
