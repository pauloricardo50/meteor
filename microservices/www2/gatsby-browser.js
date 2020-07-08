/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { registerLinkResolver } from 'gatsby-source-prismic-graphql';
import { CookiesProvider } from 'react-cookie';
import { IntlProvider } from 'react-intl';

import createTheme from 'core/config/muiCustom';
import { getFormats } from 'core/utils/localization/localizationFormats';

import Layout from './src/components/Layout';
import { WwwCalculatorProvider } from './src/components/WwwCalculator/WwwCalculatorState';
import { getLanguageData } from './src/utils/languages';
import { linkResolver } from './src/utils/linkResolver';

registerLinkResolver(linkResolver);

const theme = createTheme({ fontSize: 18 });

const wrapPageElement = ({ element, props }) => (
  <Layout {...props}>{element}</Layout>
);

const wrapRootElement = ({ element }) => (
  <CookiesProvider>
    <IntlProvider
      messages={getLanguageData()}
      formats={getFormats()}
      onError={console.warn}
      defaultLocale="fr"
    >
      <MuiThemeProvider theme={theme}>
        <WwwCalculatorProvider>{element}</WwwCalculatorProvider>
      </MuiThemeProvider>
    </IntlProvider>
  </CookiesProvider>
);

export { wrapRootElement, wrapPageElement };

// Use this variable in core if needed
window.GATSBY = true;
