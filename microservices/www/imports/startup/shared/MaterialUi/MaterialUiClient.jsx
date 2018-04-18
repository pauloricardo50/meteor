import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from 'core/config/muiCustom';

class MaterialUiExtractor extends Component {
  // Remove the server-side injected CSS.
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');
    console.log('client styles:', jssStyles);
    

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>{this.props.children}</MuiThemeProvider>
    );
  }
}

MaterialUiExtractor.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MaterialUiExtractor;
