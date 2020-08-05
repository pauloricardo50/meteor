import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'recompose';

import { analyticsVerifyEmail } from '../../api/analytics/methodDefinitions';
import { MAILCHIMP_LIST_STATUS } from '../../api/email/emailConstants';
import { updateNewsletterProfile } from '../../api/email/methodDefinitions';
import { notifyAssignee } from '../../api/slack/methodDefinitions';
import {
  getUserByPasswordResetToken,
  updateUser,
  userPasswordReset,
} from '../../api/users/methodDefinitions';
import withMatchParam from '../../containers/withMatchParam';
import pollUntilReady from '../../utils/pollUntilReady';

export default compose(withMatchParam('token'), Component => ({ token }) => {
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const history = useHistory();
  useEffect(() => {
    if (Meteor.user()) {
      // Avoid multi user issues
      Meteor.logout();
    }

    getUserByPasswordResetToken
      .run({ token })
      .then(result => {
        if (!result) {
          throw new Error('user not found');
        }
        setUser(result);
      })
      .catch(setError);
  }, []);

  const handleSubmit = values => {
    setLoading(true);
    const {
      newPassword,
      firstName,
      lastName,
      phoneNumber,
      newsletterSignup,
    } = values;

    new Promise((resolve, reject) => {
      Accounts.resetPassword(token, newPassword, err => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    })
      .then(() =>
        updateUser.run({
          userId: user._id,
          object: {
            firstName,
            lastName,
            phoneNumbers: phoneNumber ? [phoneNumber] : undefined,
          },
        }),
      )
      // Route to the next part before all these other promises run, they don't matter to the user
      .then(() => history.push('/'))
      .then(() =>
        Promise.all([
          pollUntilReady(() => !!Meteor.userId(), 250).then(() => {
            // Make sure we're logged in for tracking to work properly
            analyticsVerifyEmail.run();
            notifyAssignee.run({ title: 'A choisi/changé son mot de passe!' });
          }),
          userPasswordReset.run({}),
          newsletterSignup
            ? updateNewsletterProfile.run({
                userId: user._id,
                status: MAILCHIMP_LIST_STATUS.SUBSCRIBED,
              })
            : Promise.resolve(),
        ]),
      )
      .catch(err => {
        setLoading(false);
        throw err;
      });
  };

  return (
    <Component
      user={user}
      error={error}
      handleSubmit={handleSubmit}
      pathname={window.location?.pathname}
      loading={loading}
    />
  );
});
