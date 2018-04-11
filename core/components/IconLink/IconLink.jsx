import React from 'react';

import Icon from 'core/components/Icon';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const IconLink = ({ link, icon, text }) => (
  <Link to={link}>
    <Icon type={icon} />
    {text}
  </Link>
);

IconLink.propTypes = {
  link: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  text: PropTypes.string,
};

IconLink.defaultProps = {
  text: '',
};

export default IconLink;
