import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Bert } from 'meteor/themeteorchef:bert';
import { Accounts } from 'meteor/accounts-password';

export default class EmailVerificationPage extends Component {
  componentDidMount() {
    const token = this.props.match.params.token;

    Accounts.verifyEmail(token, error => {
      if (error) {
        this.props.history.push('/');
        Bert.alert(error.reason, 'danger');
      } else {
        this.props.history.push('/app');
        Bert.alert('Email vérifié, Merci!', 'success');
      }
    });
  }

  render() {
    return <div />;
  }
}

EmailVerificationPage.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
