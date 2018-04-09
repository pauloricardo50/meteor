import React from 'react';
import PropTypes from 'prop-types';

import { T } from './Translation';

const Roles = ({ roles }) => (
  <span>
    {roles
      .map(role => <T id={`roles.${role}`} key={role} />)
      .reduce((arr, next, index) => [
        arr,
        <span key={index}>,&nbsp;</span>,
        next,
      ])}
  </span>
);

Roles.propTypes = {
  roles: PropTypes.array.isRequired,
};

export default Roles;
