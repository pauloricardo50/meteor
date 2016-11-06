import React, { PropTypes } from 'react';

import PublicNav from '/imports/ui/containers/public/CurrentUserContainer.jsx';

// MUI Theme, replace lightBaseTheme with a custom theme ASAP!
import myTheme from '/imports/js/mui_custom.js';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const theme = myTheme;

const PublicLayout = props => (
  <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
    <main>
      <PublicNav currentUser={props.currentUser} />
      {props.content}
    </main>
  </MuiThemeProvider>
);

PublicLayout.propTypes = {
  content: PropTypes.element.isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
};


export default PublicLayout;
