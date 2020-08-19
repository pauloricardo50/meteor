import React, { useEffect } from 'react';
import {
  MuiThemeProvider,
  StylesProvider,
  jssPreset,
} from '@material-ui/core/styles';
import { create } from 'jss';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { withProps } from 'recompose';

import createTheme from '../../config/muiCustom';

const MaterialUiTheme = withProps({ theme: createTheme({}) })(MuiThemeProvider);
const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById('jss-insertion-point'),
});

const LibraryWrappers = ({ i18n: { locale, messages, formats }, children }) => {
  useEffect(() => {
    window.intlMessages = messages;
  }, [messages]);

  const content = (
    <IntlProvider
      locale={locale}
      messages={messages}
      formats={formats}
      defaultLocale="fr"
      onError={console.warn}
    >
      {children}
    </IntlProvider>
  );

  return (
    <StylesProvider jss={jss}>
      <MaterialUiTheme>{content}</MaterialUiTheme>
    </StylesProvider>
  );
};

LibraryWrappers.propTypes = {
  children: PropTypes.node.isRequired,
  i18n: PropTypes.shape({
    locale: PropTypes.string.isRequired,
    messages: PropTypes.objectOf(PropTypes.string).isRequired,
    formats: PropTypes.object.isRequired,
  }).isRequired,
};

export default LibraryWrappers;
