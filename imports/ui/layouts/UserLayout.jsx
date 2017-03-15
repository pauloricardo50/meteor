import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

import { SideNav, BottomNav } from '../containers/user/CurrentURLContainer';
import Unauthorized from '/imports/ui/components/general/Unauthorized.jsx';

// MUI Theme, replace lightBaseTheme with a custom theme ASAP!
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import myTheme from '/imports/js/mui_custom';

const theme = myTheme;

const styles = {
  topLayout: {
    verticalAlign: 'top',
  },
};

export default class UserLayout extends Component {
  render() {
    if (
      Roles.userIsInRole(this.props.currentUser, 'admin') ||
      Roles.userIsInRole(this.props.currentUser, 'partner')
    ) {
      return <Unauthorized message="Pas de partenaires ou admins ici." />;
    } else if (this.props.currentUser) {
      return (
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <div>
            {this.props.extraContent}

            <SideNav />

            <main className="user-layout">
              <div
                className="user-layout-center"
                style={this.props.top && styles.topLayout}
              >
                {this.props.content}
              </div>
            </main>

            {!this.props.noNav && <BottomNav />}

          </div>
        </MuiThemeProvider>
      );
    } else if (!this.props.currentUser) {
      Session.set('postLoginPath', FlowRouter.current().path);
      return (
        <Unauthorized
          message="Il faut être connecté pour accéder à votre compte."
          href="/login"
          label="Login"
        />
      );
    }
  }
}

UserLayout.propTypes = {
  content: PropTypes.element.isRequired,
  extraContent: PropTypes.element,
  currentUser: PropTypes.objectOf(PropTypes.any),
  noNav: PropTypes.bool,
  top: PropTypes.bool,
};
