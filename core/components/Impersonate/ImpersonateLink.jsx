import React from 'react';
import PropTypes from 'prop-types';
import { T } from 'core/components/Translation';
import IconButton from 'core/components/IconButton';
import { generateImpersonateLink } from '../../api/impersonation/impersonation';

const ImpersonateLink = ({ userId }) => (
  <a target="_blank" href={generateImpersonateLink(userId)}>
    <IconButton
      tooltip={<T id="Impersonation.impersonateLinkText" />}
      type="supervisorAccount"
    />
  </a>
);

ImpersonateLink.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default ImpersonateLink;
