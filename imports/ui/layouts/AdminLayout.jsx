import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

import { AdminNav } from '/imports/ui/containers/user/CurrentURLContainer.js';


// MUI Theme, replace lightBaseTheme with a custom theme ASAP!
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import myTheme from '/imports/js/mui_custom.js';

const theme = myTheme;


export default class AdminLayout extends Component {
  render() {
    if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return (
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <div>
            {this.props.extraContent}

            <AdminNav />

            <main className="user-layout">
              <div className="user-layout-center">
                {this.props.content}
              </div>
            </main>

          </div>
        </MuiThemeProvider>
      );
    } else {
      FlowRouter.go('/');
      return null;
    }
  }
}

AdminLayout.propTypes = {
  content: PropTypes.element.isRequired,
  extraContent: PropTypes.element,
};
