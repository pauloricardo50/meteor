import React, {PropTypes} from 'react';

import SideNav from '../components/general/SideNav.jsx';
import BottomNav from '../components/general/BottomNav.jsx';

// MUI Theme, replace lightBaseTheme with a custom theme ASAP!
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import myTheme from '/imports/js/mui_custom.js';

const theme = myTheme;

// TODO: hide navbars if there is currently no active creditRequest


const UserLayout = props => (
  <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
    <div>
      {props.extraContent}

      <SideNav />

      <main className="user-layout">
        {props.content}
      </main>

      <BottomNav />

    </div>
  </MuiThemeProvider>
);

UserLayout.propTypes = {
  content: PropTypes.element.isRequired,
  extraContent: PropTypes.element,
};

export default UserLayout;
