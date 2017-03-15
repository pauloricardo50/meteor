import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

// MUI Theme, replace lightBaseTheme with a custom theme ASAP!
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import myTheme from '/imports/js/mui_custom';

const theme = myTheme;

const Unauthorized = props => (
  <div className="text-center">
    <h1>{props.message || "On dirait qu'il y a eu une erreur"}</h1>

    <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
      <RaisedButton
        label={props.label || 'Home'}
        primary
        href={props.href || '/'}
      />
    </MuiThemeProvider>
  </div>
);

Unauthorized.propTypes = {
  message: PropTypes.string,
  href: PropTypes.string,
  label: PropTypes.string,
};

export default Unauthorized;
