import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Bert } from 'meteor/themeteorchef:bert';
import { Accounts } from 'meteor/accounts-password';
import { injectIntl } from 'react-intl';

class EmailVerificationPage extends Component {
  componentDidMount() {
    const token = this.props.match.params.token;

    if (!token) {
      this.props.history.push('/');
    }

    Accounts.verifyEmail(token, error => {
      if (error) {
        this.props.history.push('/');
        Bert.alert(error.reason, 'danger');
      } else {
        this.props.history.push('/app');
        Bert.alert(this.props.intl.formatMessage({ id: 'EmailVerification.message' }), 'success');
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

export default injectIntl(EmailVerificationPage);
