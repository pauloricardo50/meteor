import { Accounts } from 'meteor/accounts-base';

import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router-dom';

import { TRACKING_COOKIE } from '../../api/analytics/analyticsConstants';
import { analyticsVerifyEmail } from '../../api/analytics/methodDefinitions';
import { userVerifyEmail } from '../../api/users/methodDefinitions';
import { getCookie } from '../../utils/cookiesHelpers';

const EmailVerificationPage = () => {
  const { formatMessage } = useIntl();
  const history = useHistory();
  const { token } = useParams();

  useEffect(() => {
    if (!token) {
      history.push('/');
    }

    Accounts.verifyEmail(token, error => {
      if (error) {
        history.push('/');

        import('../../utils/message').then(({ default: message }) => {
          message.error(formatMessage({ id: 'EmailVerification.error' }), 5);
        });
      } else {
        const msg = formatMessage({ id: 'EmailVerification.message' });
        import('../../utils/message').then(({ default: message }) => {
          message.success(msg, 2);
        });

        analyticsVerifyEmail.run({ trackingId: getCookie(TRACKING_COOKIE) });
        userVerifyEmail.run({});

        history.push('/');
      }
    });
  }, []);

  return <section id="email-verification-page" />;
};

export default EmailVerificationPage;
