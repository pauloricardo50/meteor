import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { IMPERSONATE_SESSION_KEY } from '../../api/impersonation/impersonation';
import { T } from 'core/components/Translation';

export const ImpersonateWarning = ({ isActive }) => {
  if (!isActive) {
    return null;
  }

  return (
    <div className="impersonate-warning">
      <T id="Impersonation.currentlyImpersonating" />
    </div>
  );
};

ImpersonateWarning.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

export const ImpersonateWarningWithTracker = withTracker(() => {
  return {
    isActive: Session.get(IMPERSONATE_SESSION_KEY),
  };
})(ImpersonateWarning);
