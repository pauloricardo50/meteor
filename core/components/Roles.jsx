import React from 'react';
import PropTypes from 'prop-types';

import { T } from './Translation';

const Roles = ({ roles }) => (
  <span>
    {roles
      .map(role => <T id={`roles.${role}`} key={role} />)
      .reduce((acc, currentValue, currentIndex) => [
        acc,
        <span key={currentIndex}>,&nbsp;</span>,
        currentValue,
      ])}
  </span>
);

Roles.propTypes = {
  roles: PropTypes.array,
};

Roles.defaultProps = {
  roles: [],
};

export default Roles;
