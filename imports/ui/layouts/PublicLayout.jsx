import React, { PropTypes } from 'react';

import PublicNav from '/imports/ui/components/general/PublicNav.jsx';

// MUI Theme, replace lightBaseTheme with a custom theme ASAP!
import myTheme from '/imports/js/mui_custom.js';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const theme = myTheme;

const PublicLayout = props => (
  <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
    <main>
      <PublicNav />
      {props.content}
    </main>
  </MuiThemeProvider>
);

PublicLayout.propTypes = {
  content: PropTypes.element.isRequired,
};


export default PublicLayout;
