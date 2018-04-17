import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { IntlProvider } from 'react-intl';
import { withProps } from 'recompose';

import theme from '../../config/muiCustom';

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
  WrapperComponent: PropTypes.any,
  i18n: PropTypes.shape({
    locale: PropTypes.string.isRequired,
    messages: PropTypes.objectOf(PropTypes.string).isRequired,
    formats: PropTypes.object.isRequired,
  }).isRequired,
  withMui: PropTypes.bool,
};

LibraryWrappers.defaultProps = {
  WrapperComponent: React.Fragment,
  withMui: true,
};

export default withProps(({ withMui }) => ({
  MuiWrapper: withMui ? <MuiThemeProvider theme={theme} /> : React.Fragment,
}))(LibraryWrappers);
