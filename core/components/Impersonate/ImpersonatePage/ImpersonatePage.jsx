import { Meteor } from 'meteor/meteor';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { impersonateUser } from '../../api';

class ImpersonatePage extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  componentDidMount = () => {
    const {
      location,
      history,
      intl: { formatMessage },
    } = this.props;
    const paramsQuery = new URLSearchParams(location.search);
    const userId = paramsQuery.get('userId');
    const authToken = paramsQuery.get('authToken');

    impersonateUser.run({ userId, authToken }).then(({ emails }) => {
      Meteor.connection.setUserId(userId);
      import('../../../utils/notification').then(({ default: notification }) => {
        notification.success({
          message: <span id="impersonation-success-message">Yay</span>,
          description: formatMessage(
            { id: 'Impersonation.impersonationSuccess' },
            { email: emails[0].address },
          ),
          duration: 5,
        });
      });

      history.push('/');
    });
  };

  render() {
    return <section className="impersonate-page">Impersonating...</section>;
  }
}

export default injectIntl(ImpersonatePage);
