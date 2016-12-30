import React, { PropTypes } from 'react';

import { PublicNav } from '/imports/ui/containers/public/CurrentUserContainer.js';

// MUI Theme, replace lightBaseTheme with a custom theme ASAP!
import myTheme from '/imports/js/mui_custom.js';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


const PublicLayout = props => (
  <MuiThemeProvider muiTheme={getMuiTheme(myTheme)}>
    <div>
      <PublicNav currentUser={props.currentUser} />
      <main className="public-layout">
        {props.content}
      </main>
    </div>
  </MuiThemeProvider>
);

PublicLayout.propTypes = {
  content: PropTypes.element.isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
};


export default PublicLayout;
