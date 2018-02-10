import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Bert } from 'meteor/themeteorchef:bert';
import { Accounts } from 'meteor/accounts-base';
import { injectIntl } from 'react-intl';

class EmailVerificationPage extends Component {
  componentDidMount() {
    const token = this.props.match.params.token;

    if (!token) {
      this.props.history.push('/');
    }

    Accounts.verifyEmail(token, (error) => {
      if (error) {
        this.props.history.push('/');
        console.log(error.reason);
        Bert.alert(
          this.props.intl.formatMessage({
            id: 'EmailVerification.error',
          }),
          'danger',
        );
      } else {
        const message = `<h3 style="color:white;margin:0;">${this.props.intl.formatMessage(
          {
            id: 'EmailVerification.message',
          },
        )}</h3>`;
        Bert.alert(message, 'success');
        this.props.history.push('/');
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
