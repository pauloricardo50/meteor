import React from 'react';
import { Accounts } from 'meteor/std:accounts-ui';

export default class LoginPage extends React.Component {
  render() {
    return (
      <Accounts.ui.LoginForm />
    );
  }
}
