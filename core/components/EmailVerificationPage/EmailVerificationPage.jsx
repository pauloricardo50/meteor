import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accounts } from 'meteor/accounts-base';
import { injectIntl } from 'react-intl';

class EmailVerificationPage extends Component {
  componentDidMount() {
    const {
      match: {
        params: { token },
      },
      history,
      intl,
    } = this.props;

    if (!token) {
      history.push('/');
    }

    Accounts.verifyEmail(token, (error) => {
      if (error) {
        history.push('/');

        import('../../utils/message').then(({ default: message }) => {
          message.error(
            intl.formatMessage({
              id: 'EmailVerification.error',
            }),
            5,
          );
        });
      } else {
        const msg = intl.formatMessage({ id: 'EmailVerification.message' });
        import('../../utils/message').then(({ default: message }) => {
          message.success(msg, 2);
        });
        history.push('/');
      }
    });
  }

  render() {
    return <section id="email-verification-page" />;
  }
}

EmailVerificationPage.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default injectIntl(EmailVerificationPage);
