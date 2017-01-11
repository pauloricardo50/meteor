import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

import { PublicNav } from '/imports/ui/containers/public/CurrentUserContainer.js';
import RaisedButton from 'material-ui/RaisedButton';


// MUI Theme, replace lightBaseTheme with a custom theme ASAP!
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import myTheme from '/imports/js/mui_custom.js';

const theme = myTheme;

export default class PartnerLayout extends Component {
  routeToLogin() {
    Session.set('postLoginPath', FlowRouter.current().path)
    FlowRouter.go('/login');
  }

  render() {
    if (Meteor.userId() &&
      (Roles.userIsInRole(Meteor.userId(), 'admin') || Roles.userIsInRole(Meteor.userId(), 'partner'))
    ) {
      return (
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <div>
            <PublicNav currentUser={this.props.currentUser} />
            <main className="default-layout">
              <div className="default-layout-center">
                {this.props.content}
              </div>
            </main>
          </div>
        </MuiThemeProvider>
      );
    } else if (Meteor.userId()) {
      return (
        <div className="text-center">
          <h1>On dirait qu&apos;il y a eu une erreur!</h1>
          <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
            <RaisedButton
              label="Retour"
              href="/"
              primary
            />
          </MuiThemeProvider>
        </div>
      );
    } else {
      this.routeToLogin();
      return null;
    }
  }
}

PartnerLayout.propTypes = {
  content: PropTypes.element.isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
};
