import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router-dom';

import { analyticsVerifyEmail } from '../../api/analytics/methodDefinitions';
import { userVerifyEmail } from '../../api/users/methodDefinitions';
import pollUntilReady from '../../utils/pollUntilReady';

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

        pollUntilReady(() => !!Meteor.userId(), 250).then(() => {
          // Make sure we're logged in for tracking to work properly
          analyticsVerifyEmail.run();
          userVerifyEmail.run();
        });

        history.push('/');
      }
    });
  }, []);

  return <section id="email-verification-page" />;
};

export default EmailVerificationPage;
