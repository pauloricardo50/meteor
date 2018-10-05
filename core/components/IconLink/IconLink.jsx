import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Icon from 'core/components/Icon';

const IconLink = ({ link, icon, text, children, ...rest }) => (
  <Link to={link} className="icon-link" {...rest}>
    <Icon type={icon} className="icon-link-icon" />
    {children || text}
  </Link>
);

IconLink.propTypes = {
  icon: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  text: PropTypes.node.isRequired,
};

export default IconLink;
