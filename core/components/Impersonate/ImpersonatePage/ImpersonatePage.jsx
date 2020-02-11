import { Meteor } from 'meteor/meteor';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { impersonateUser } from '../../../api/methods';
import impersonateNotification from './impersonateNotification';

export const impersonate = async ({
  userId,
  authToken,
  history,
  adminId,
  logoutOnMount,
}) => {
  if (logoutOnMount && Meteor.userId()) {
    await new Promise((resolve, reject) =>
      Meteor.logout(err => {
        if (err) {
          reject(err);
        }
        resolve();
      }),
    );
  }

  const { email } = await impersonateUser.run({ userId, authToken, adminId });
  Meteor.connection.setUserId(userId);
  impersonateNotification(email);

  if (history) {
    history.push('/');
  }

  if (Meteor.isDevelopment) {
    sessionStorage.setItem('dev_impersonate_adminId', adminId);
    sessionStorage.setItem('dev_impersonate_userId', userId);
    sessionStorage.setItem('dev_impersonate_authToken', authToken);
  }
};

class ImpersonatePage extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  componentDidMount = () => {
    const { location, history, logoutOnMount } = this.props;
    const paramsQuery = new URLSearchParams(location.search);
    const userId = paramsQuery.get('userId');
    const authToken = paramsQuery.get('authToken');
    const adminId = paramsQuery.get('adminId');

    impersonate({ userId, authToken, history, adminId, logoutOnMount });
  };

  render() {
    return <section className="impersonate-page">Impersonating...</section>;
  }
}

export default ImpersonatePage;
