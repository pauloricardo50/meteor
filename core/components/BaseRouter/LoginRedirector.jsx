// @flow
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Accounts } from 'meteor/accounts-base';

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { isOnAllowedRoute, WITHOUT_LOGIN } from '../../utils/redirection';
import Loading from '../Loading';

// This component automatically sends a user to the login page
// Without first loading an unallowed route, that adds to the bundle size
// it allows the /login route to be very light weight
class LoginRedirector extends Component {
  constructor(props) {
    super(props);
    const { hasLogin, history } = this.props;

    const isAllowed = isOnAllowedRoute(
      history.location.pathname,
      WITHOUT_LOGIN,
    );

    if (!hasLogin || isAllowed) {
      this.state = { loading: false };
    } else {
      this.state = { loading: true };
    }
  }

  componentDidMount() {
    const { loading } = this.state;
    const { hasLogin, history } = this.props;

    if (!loading) {
      return;
    }

    Tracker.autorun(() => {
      if (Accounts.loginServicesConfigured()) {
        const isLoggedIn = Meteor.userId();

        if (!isLoggedIn) {
          history.push('/login');
        }

        this.setState({ loading: false });
      }
    });
  }

  render() {
    const { loading } = this.state;
    const { children } = this.props;

    if (loading) {
      return <Loading />;
    }

    return children;
  }
}

export default withRouter(LoginRedirector);
