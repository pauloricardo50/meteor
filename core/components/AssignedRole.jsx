import React from 'react';
import PropTypes from 'prop-types';

import T from './Translation';

const AssignedRole = ({ roles, className }) => {
  const { _id: assignedRole } = roles.find(({ assigned }) => assigned);

  return (
    <span className={className}>
      <T id={`roles.${assignedRole}`} />
    </span>
  );
};

AssignedRole.propTypes = {
  className: PropTypes.string,
  roles: PropTypes.array,
};

AssignedRole.defaultProps = {
  className: '',
  roles: [],
};

export default AssignedRole;
