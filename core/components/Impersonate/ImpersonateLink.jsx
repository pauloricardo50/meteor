import React from 'react';
import PropTypes from 'prop-types';
import { generateImpersonateLink } from '../../api/impersonation/impersonation';
import { T } from 'core/components/Translation';

const ImpersonateLink = ({ userId }) => {
  return (
    <a target="_blank" href={generateImpersonateLink(userId)}>
      <T id="Impersonation.impersonateLinkText" />
    </a>
  );
};

ImpersonateLink.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default ImpersonateLink;
