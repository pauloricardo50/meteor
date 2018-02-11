import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { IntlProvider } from 'react-intl';

import MuiTheme from '../../config/mui_custom';

const LibraryWrappers = ({
  i18n: { locale, messages, formats },
  WrapperComponent,
  children
}) => {
  return (
    <WrapperComponent>
      {/* Inject custom material-ui theme for everything to look good */}
      <MuiThemeProvider theme={MuiTheme}>
        {/* Inject Intl props to all components to render the proper locale */}
        <IntlProvider
          locale={locale}
          messages={messages}
          formats={formats}
          defaultLocale="fr"
        >
          {children}
        </IntlProvider>
      </MuiThemeProvider>
    </WrapperComponent>
  );
};

LibraryWrappers.propTypes = {
  children: PropTypes.node.isRequired,
  WrapperComponent: PropTypes.any,
  i18n: PropTypes.shape({
    locale: PropTypes.string.isRequired,
    messages: PropTypes.objectOf(PropTypes.string).isRequired,
    formats: PropTypes.object.isRequired
  })
};

LibraryWrappers.defaultProps = {
  WrapperComponent: React.Fragment
};

export default LibraryWrappers;
