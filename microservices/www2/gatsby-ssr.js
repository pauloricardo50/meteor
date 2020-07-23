/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { registerLinkResolver } from '@prismicio/gatsby-source-prismic-graphql';
import { IntlProvider } from 'react-intl';

import { getFormats } from 'core/utils/localization/localizationFormats';

import Layout from './src/components/Layout';
import { WwwCalculatorProvider } from './src/components/WwwCalculator/WwwCalculatorState';
import createTheme from './src/core/config/muiCustom';
import { getLanguageData } from './src/utils/languages';
import { linkResolver } from './src/utils/linkResolver';

registerLinkResolver(linkResolver);

const theme = createTheme({ fontSize: 18 });

const wrapPageElement = ({ element, props }) => (
  <Layout {...props}>{element}</Layout>
);
const wrapRootElement = ({ element }) => (
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
);

export { wrapRootElement, wrapPageElement };
