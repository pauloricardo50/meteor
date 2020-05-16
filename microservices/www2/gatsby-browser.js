/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { registerLinkResolver } from 'gatsby-source-prismic-graphql';

import createTheme from './src/core/config/muiCustom';
import { linkResolver } from './src/utils/linkResolver';

registerLinkResolver(linkResolver);

const theme = createTheme({ fontSize: 18 });

const wrapRootElement = ({ element }) => (
  <CookiesProvider>
    <MuiThemeProvider theme={theme}>{element}</MuiThemeProvider>
  </CookiesProvider>
);

export { wrapRootElement };

// Use this variable in core if needed
window.GATSBY = true;
