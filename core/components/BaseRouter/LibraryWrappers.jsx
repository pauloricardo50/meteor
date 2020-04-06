import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { IntlProvider } from 'react-intl';
import { withProps } from 'recompose';

import createTheme from '../../config/muiCustom';

const MaterialUiTheme = withProps({ theme: createTheme({}) })(MuiThemeProvider);

const LibraryWrappers = ({
  i18n: { locale, messages, formats },
  children,
  withMui = true,
}) => {
  const content = (
    <IntlProvider
      locale={locale}
      messages={messages}
      formats={formats}
      defaultLocale="fr"
    >
      {children}
    </IntlProvider>
  );

  if (!withMui) {
    return content;
  }

  return <MaterialUiTheme>{content}</MaterialUiTheme>;
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
