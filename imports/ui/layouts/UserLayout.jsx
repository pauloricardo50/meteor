import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { SideNav } from '../containers/user/ActiveRequestContainer.jsx';
import { BottomNav } from '../containers/user/CurrentURLContainer.jsx';

// MUI Theme, replace lightBaseTheme with a custom theme ASAP!
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import myTheme from '/imports/js/mui_custom.js';

const theme = myTheme;

// TODO: hide navbars if there is currently no active creditRequest


export default class UserLayout extends Component {

  componentDidMount() {
    // Anyone coming to a userlayout page without being logged in, is taken to the login page.
    // TODO: add a parameter to the URL to indicate which route this person came from, so that
    // When he logs in, he's taken to that URL
    if (!Meteor.userId()) {
      FlowRouter.go('/login');
    }
  }

  render() {
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
  }

}

UserLayout.propTypes = {
  content: PropTypes.element.isRequired,
  extraContent: PropTypes.element,
};
