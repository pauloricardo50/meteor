import { Accounts } from 'meteor/accounts-base';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { TRACKING_COOKIE } from '../../api/analytics/analyticsConstants';
import { analyticsVerifyEmail } from '../../api/analytics/methodDefinitions';
import { userVerifyEmail } from '../../api/users/methodDefinitions';
import { getCookie } from '../../utils/cookiesHelpers';

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

    Accounts.verifyEmail(token, error => {
      if (error) {
        history.push('/');

        import('../../utils/message').then(({ default: message }) => {
          message.error(
            intl.formatMessage({ id: 'EmailVerification.error' }),
            5,
          );
        });
      } else {
        const msg = intl.formatMessage({ id: 'EmailVerification.message' });
        import('../../utils/message').then(({ default: message }) => {
          message.success(msg, 2);
        });

        analyticsVerifyEmail.run({ trackingId: getCookie(TRACKING_COOKIE) });
        userVerifyEmail.run({});

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
