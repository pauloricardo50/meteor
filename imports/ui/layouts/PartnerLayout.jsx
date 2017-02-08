import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

import { PublicNav } from '/imports/ui/containers/public/CurrentUserContainer';
import Unauthorized from '/imports/ui/components/general/Unauthorized.jsx';


// MUI Theme, replace lightBaseTheme with a custom theme ASAP!
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import myTheme from '/imports/js/mui_custom';

const theme = myTheme;

export default class PartnerLayout extends Component {
  render() {
    if (this.props.currentUser &&
      (Roles.userIsInRole(this.props.currentUser, 'admin') ||
      Roles.userIsInRole(this.props.currentUser, 'partner'))
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
    } else if (this.props.currentUser) {
      return (
        <Unauthorized
          message="Oops, on dirait que vous vous êtes égaré."
        />
      );
    } else {
      Session.set('postLoginPath', FlowRouter.current().path)
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

PartnerLayout.propTypes = {
  content: PropTypes.element.isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
};
