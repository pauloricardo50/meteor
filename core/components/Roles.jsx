import React from 'react';
import PropTypes from 'prop-types';

import T from './Translation';

const Roles = ({ roles, className }) => (
  <span className={className}>
    {roles && roles.length > 0
      ? roles
          .map(role => <T id={`roles.${role}`} key={role} />)
          .reduce((acc, currentValue, currentIndex) => [
            acc,
            <span key={currentIndex}>,&nbsp;</span>,
            currentValue,
          ])
      : null}
  </span>
);

Roles.propTypes = {
  className: PropTypes.string,
  roles: PropTypes.array,
};

Roles.defaultProps = {
  className: '',
  roles: [],
};

export default Roles;
