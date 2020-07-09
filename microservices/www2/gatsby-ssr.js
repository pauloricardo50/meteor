/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { registerLinkResolver } from 'gatsby-source-prismic-graphql';
import { IntlProvider } from 'react-intl';

import createTheme from './src/core/config/muiCustom';
import { getLanguageData } from './src/utils/languages';
import { linkResolver } from './src/utils/linkResolver';

registerLinkResolver(linkResolver);

const theme = createTheme({ fontSize: 18 });

const wrapRootElement = ({ element }) => (
  <IntlProvider messages={getLanguageData()}>
    <MuiThemeProvider theme={theme}>{element}</MuiThemeProvider>
  </IntlProvider>
);

export { wrapRootElement };
