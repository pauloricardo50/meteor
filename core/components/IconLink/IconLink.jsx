import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Icon from 'core/components/Icon';

const IconLink = ({ link, icon, text }) => (
  <Link to={link} className="icon-link">
    <Icon type={icon} className="icon-link-icon" />
    {text}
  </Link>
);

IconLink.propTypes = {
  link: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  text: PropTypes.node.isRequired,
};

export default IconLink;
