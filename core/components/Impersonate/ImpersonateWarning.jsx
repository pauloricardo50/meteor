import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import React from 'react';
import PropTypes from 'prop-types';

import formatMessage from '../../utils/intl';
import { IMPERSONATE_SESSION_KEY } from '../../api/impersonation/impersonation';

export const ImpersonateWarning = ({ isActive, currentUser }) => {
  if (!isActive || !currentUser) {
    return null;
  }

  const currentUserEmail = currentUser.emails[0].address;

  return (
    <div className="warning">
      <strong>
        {formatMessage('Impersonation.impersonateWarning', {
          email: currentUserEmail,
        })}
      </strong>
    </div>
  );
};

ImpersonateWarning.propTypes = {
  isActive: PropTypes.bool,
  currentUser: PropTypes.object,
};

ImpersonateWarning.defaultProps = {
  isActive: false,
  currentUser: undefined,
};

export const ImpersonateWarningWithTracker = withTracker(() => ({
  isActive: Session.get(IMPERSONATE_SESSION_KEY),
  currentUser: Meteor.user(),
}))(ImpersonateWarning);
