import React from 'react';
import PropTypes from 'prop-types';
import { generateImpersonateLink } from '../../api/impersonation/impersonation';

const ImpersonateLink = ({ userId }) => {
  return (
    <a target="_blank" href={generateImpersonateLink(userId)}>
      Impersonate
    </a>
  );
};

ImpersonateLink.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default ImpersonateLink;
