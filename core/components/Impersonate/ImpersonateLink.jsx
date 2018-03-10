import React from 'react';
import PropTypes from 'prop-types';
import { T } from 'core/components/Translation';
import { generateImpersonateLink } from '../../api/impersonation/impersonation';

const ImpersonateLink = ({ userId }) => (
  <a target="_blank" href={generateImpersonateLink(userId)}>
    <T id="Impersonation.impersonateLinkText" />
  </a>
);

ImpersonateLink.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default ImpersonateLink;
