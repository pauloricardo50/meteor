import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { IntlProvider } from 'react-intl';
import { withProps } from 'recompose';

import createTheme from '../../config/muiCustom';

const LibraryWrappers = ({
  i18n: { locale, messages, formats },
  WrapperComponent,
  children,
  MuiWrapper,
}) => (
  <WrapperComponent>
    {/* Inject custom material-ui theme for everything to look good */}
    <MuiWrapper>
      {/* Inject Intl props to all components to render the proper locale */}
      <IntlProvider
        locale={locale}
        messages={messages}
        formats={formats}
        defaultLocale="fr"
      >
        {children}
      </IntlProvider>
    </MuiWrapper>
  </WrapperComponent>
);

LibraryWrappers.propTypes = {
  children: PropTypes.node.isRequired,
  i18n: PropTypes.shape({
    locale: PropTypes.string.isRequired,
    messages: PropTypes.objectOf(PropTypes.string).isRequired,
    formats: PropTypes.object.isRequired,
  }).isRequired,
  WrapperComponent: PropTypes.any,
};

LibraryWrappers.defaultProps = {
  WrapperComponent: React.Fragment,
};

// Can toggle material-ui off with the `withMui` prop
export default withProps(({ withMui = true }) => ({
  MuiWrapper: withMui
    ? withProps({ theme: createTheme() })(MuiThemeProvider)
    : React.Fragment,
}))(LibraryWrappers);
