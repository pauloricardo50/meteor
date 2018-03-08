import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { IMPERSONATE_USER } from 'core/api/impersonation/defs';
import { IMPERSONATE_SESSION_KEY } from 'core/api/impersonation/impersonation';
import { callMutation } from 'core/api';
import { Bert } from 'meteor/themeteorchef:bert';
import { injectIntl } from 'react-intl';

class ImpersonatePage extends Component {
  static propTypes = {
    prop: PropTypes,
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
