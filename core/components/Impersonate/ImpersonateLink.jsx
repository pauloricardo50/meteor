import React from 'react';
import PropTypes from 'prop-types';
import { T } from 'core/components/Translation';
import IconButton from 'core/components/IconButton';
import { generateImpersonateLink } from '../../api/impersonation/impersonation';
import { isUser } from '../../utils/userFunctions';

const ImpersonateLink = ({ user, className }) => {
  if (!isUser(user)) {
    return null;
  }

  return (
    <a
      target="_blank"
      href={generateImpersonateLink(user._id)}
      className={className}
    >
      <IconButton
        tooltip={<T id="Impersonation.impersonateLinkText" />}
        type="supervisorAccount"
      />
    </a>
  );
};

ImpersonateLink.propTypes = {
  user: PropTypes.object.isRequired,
  className: PropTypes.string,
};

ImpersonateLink.defaultProps = {
  // This `undefined` default value makes sure the `class` html attribute
  // doesn't get rendered when no className prop is passed, for performance.
  className: undefined,
};

export default ImpersonateLink;
