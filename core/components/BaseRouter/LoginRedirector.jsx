// @flow
import { Meteor } from 'meteor/meteor';

import { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { isOnAllowedRoute, WITHOUT_LOGIN } from '../../utils/redirection';

// This component automatically sends a user to the login page
// Without first loading an allowed route, that adds to the bundle size
// it allows the /login route to be very light weight
class LoginRedirector extends Component {
  componentDidMount() {
    const { hasLogin, history } = this.props;

    if (!hasLogin) {
      return;
    }

    const isLoggedIn = Meteor.user();
    const isAllowed = isOnAllowedRoute(
      history.location.pathname,
      WITHOUT_LOGIN,
    );

    if (!isLoggedIn && !isAllowed) {
      history.push('/login');
    }
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

export default withRouter(LoginRedirector);
