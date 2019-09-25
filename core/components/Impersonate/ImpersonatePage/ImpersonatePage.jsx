import { Meteor } from 'meteor/meteor';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import {
  impersonateUser,
  shareImpersonatedSession,
} from '../../../api/methods';

export const impersonate = ({ userId, authToken, history }) => {
  impersonateUser
    .run({ userId, authToken })
    .then(({ emails }) => {
      Meteor.connection.setUserId(userId);
      import('../../../utils/notification').then(({ default: notification }) => {
        notification.success({
          message: <span id="impersonation-success-message">Yay</span>,
          description: (
            <div>
              <p>{`Acutellement connecté comme ${emails[0].address}`}</p>
              <div className="p-8">
                <Button
                  onClick={() =>
                    shareImpersonatedSession
                      .run()
                      .then(() => notification.destroy())
                  }
                  primary
                  outlined
                >
                    Partager la session
                </Button>
              </div>
            </div>
          ),
          duration: 0,
        });
      });
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

    impersonate({ userId, authToken, history });
  };

  render() {
    return <section className="impersonate-page">Impersonating...</section>;
  }
}

export default ImpersonatePage;
