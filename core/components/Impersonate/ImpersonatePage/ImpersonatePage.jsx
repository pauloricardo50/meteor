import { Meteor } from 'meteor/meteor';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { impersonateUser } from '../../../api/methods';
import impersonateNotification from './impersonateNotification';

export const impersonate = ({ userId, authToken, history, adminId }) => {
  impersonateUser
    .run({ userId, authToken, adminId })
    .then(({ emails }) => {
      Meteor.connection.setUserId(userId);
      impersonateNotification(emails);
      if (history) {
        history.push('/');
      }
    })
    .then(() => {
      if (Meteor.isDevelopment) {
        sessionStorage.setItem('dev_impersonate_userId', userId);
        sessionStorage.setItem('dev_impersonate_authToken', authToken);
      }
    });
};

class ImpersonatePage extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  componentDidMount = () => {
    const { location, history } = this.props;
    const paramsQuery = new URLSearchParams(location.search);
    const userId = paramsQuery.get('userId');
    const authToken = paramsQuery.get('authToken');
    const adminId = paramsQuery.get('adminId');

    impersonate({ userId, authToken, history, adminId });
  };

  render() {
    return <section className="impersonate-page">Impersonating...</section>;
  }
}

export default ImpersonatePage;
