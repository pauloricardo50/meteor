import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { TRACKING_COOKIE } from '../../api/analytics/analyticsConstants';
import { analyticsVerifyEmail } from '../../api/analytics/methodDefinitions';
import { notifyAssignee } from '../../api/slack/methodDefinitions';
import {
  getUserByPasswordResetToken,
  updateUser,
  userPasswordReset,
} from '../../api/users/methodDefinitions';
import withMatchParam from '../../containers/withMatchParam';
import { getCookie } from '../../utils/cookiesHelpers';

export default compose(
  withMatchParam('token'),
  withRouter,
  Component => ({ token, history }) => {
    const [user, setUser] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState();
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
      const { newPassword, firstName, lastName, phoneNumber } = values;

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
        .then(() =>
          Promise.all([
            notifyAssignee.run({
              title: 'A choisi/changé son mot de passe!',
            }),
            analyticsVerifyEmail.run({
              trackingId: getCookie(TRACKING_COOKIE),
            }),
            userPasswordReset.run({}),
          ]),
        )
        .then(() => history.push('/'))
        .catch(err => {
          // Don't clear loading if the submission is successful, because it
          // should route to '/' always, and the user shouldn't click on submit twice
          setLoading(false);
          throw err;
        });
    };

    return (
      <Component
        user={user}
        error={error}
        handleSubmit={handleSubmit}
        pathname={window.location && window.location.pathname}
        loading={loading}
      />
    );
  },
);
