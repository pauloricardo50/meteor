import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

import { SideNav, BottomNav } from '../containers/user/CurrentURLContainer.js';

// MUI Theme, replace lightBaseTheme with a custom theme ASAP!
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import myTheme from '/imports/js/mui_custom.js';

const theme = myTheme;


// TODO: hide navbars if there is currently no active loanRequest

export default class UserLayout extends Component {

  routeToLogin() {
    Session.set('postLoginPath', FlowRouter.current().path)
    FlowRouter.go('/login');
  }

  render() {
    if (Roles.userIsInRole(Meteor.userId(), 'admin') || Roles.userIsInRole(Meteor.userId(), 'partner')) {
      return null;
    } else if (Meteor.userId()) {
      return (
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <div>
            {this.props.extraContent}

            <SideNav />

            <main className="user-layout">
              <div className="user-layout-center">
                {this.props.content}
              </div>
            </main>

            <BottomNav />

          </div>
        </MuiThemeProvider>
      );
    } else {
      this.routeToLogin();
      return null;
    }
  }

}

UserLayout.propTypes = {
  content: PropTypes.element.isRequired,
  extraContent: PropTypes.element,
};
