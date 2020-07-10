/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { registerLinkResolver } from 'gatsby-source-prismic-graphql';
import { CookiesProvider } from 'react-cookie';
import { IntlProvider } from 'react-intl';

import createTheme from './src/core/config/muiCustom';
import { getLanguageData } from './src/utils/languages';
import { linkResolver } from './src/utils/linkResolver';

registerLinkResolver(linkResolver);

const theme = createTheme({
  fontSize: 18,
  overrideTheme: {
    overrides: {
      MuiExpansionPanel: {
        root: { backgroundColor: 'transparent', boxShadow: 'none' },
      },
    },
  },
});

const wrapRootElement = ({ element }) => (
  <CookiesProvider>
    <IntlProvider messages={getLanguageData()}>
      <MuiThemeProvider theme={theme}>{element}</MuiThemeProvider>
    </IntlProvider>
  </CookiesProvider>
);

export { wrapRootElement };

// Use this variable in core if needed
window.GATSBY = true;
