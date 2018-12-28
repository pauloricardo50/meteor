// @flow
import { Meteor } from 'meteor/meteor';

import { Component } from 'react';
import { withRouter } from 'react-router-dom';

// This is used in our E2E tests to speed up routing
// Use cy.routeTo() instead of cy.visit()
// Though you need to visit() first before this works to get the app running
class TestHistory extends Component {
  componentDidMount() {
    if (Meteor.isAppTest) {
      window.reactHistory = this.props.history;
    }
  }

  render() {
    return null;
  }
}

export default withRouter(TestHistory);
