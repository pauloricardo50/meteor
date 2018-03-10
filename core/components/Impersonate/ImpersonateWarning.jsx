import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import { IMPERSONATE_SESSION_KEY } from '../../api/impersonation/impersonation';

export const ImpersonateWarning = ({ isActive }) => {
  if (!isActive) {
    return null;
  }

  return (
    <div className="impersonate-warning">
      <strong>
        <T id="Impersonation.impersonateWarning" />
      </strong>
    </div>
  );
};

ImpersonateWarning.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

export const ImpersonateWarningWithTracker = withTracker(() => ({
  isActive: Session.get(IMPERSONATE_SESSION_KEY),
}))(ImpersonateWarning);
