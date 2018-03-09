import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { callMutation } from 'core/api';
import { IMPERSONATE_USER } from 'core/api/impersonation/defs';
import { IMPERSONATE_SESSION_KEY } from 'core/api/impersonation/impersonation';

class ImpersonatePage extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  componentDidMount = () => {
    const { location, history } = this.props;
    const paramsQuery = new URLSearchParams(location.search);
    const userId = paramsQuery.get('userId');
    const authToken = paramsQuery.get('authToken');

    callMutation(IMPERSONATE_USER, {
      userId,
      authToken,
    }).then(() => {
      Meteor.connection.setUserId(userId);
      Session.setPersistent(IMPERSONATE_SESSION_KEY, true);

      Bert.alert({
        title: 'Success!',
        message: `<h3 class="bert">${this.props.intl.formatMessage({
          id: 'Impersonation.impersonationSuccess',
        })}</h3>`,
        type: 'success',
        style: 'fixed-top',
      });

      history.push('/profile');
    });
  };

  render() {
    return <div>Impersonating.....</div>;
  }
}

export default injectIntl(ImpersonatePage);
