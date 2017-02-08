import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

import { AdminNav } from '/imports/ui/containers/user/CurrentURLContainer';
import Unauthorized from '/imports/ui/components/general/Unauthorized.jsx';


// MUI Theme, replace lightBaseTheme with a custom theme ASAP!
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import myTheme from '/imports/js/mui_custom';

const theme = myTheme;


export default class AdminLayout extends Component {
  render() {
    if (this.props.currentUser && Roles.userIsInRole(this.props.currentUser, 'admin')) {
      return (
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <div>
            {this.props.extraContent}

            <AdminNav />

            <main className="user-layout admin">
              <div className="user-layout-center">
                {this.props.content}
              </div>
            </main>

          </div>
        </MuiThemeProvider>
      );
    } else {
      return (
        <Unauthorized
          message="Connectez-vous d'abord!"
          label="Login"
          href="/login"
        />
      );
    }
  }
}

AdminLayout.propTypes = {
  content: PropTypes.element.isRequired,
  extraContent: PropTypes.element,
  currentUser: PropTypes.objectOf(PropTypes.any),
};
