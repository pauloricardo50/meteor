import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';
import Link from '../Link';

const IconLink = React.forwardRef(({ link, icon, text, children, className, ...rest }, ref) => (
  <Link
    to={link}
    className="icon-link"
    onClick={e => e.stopPropagation()}
    innerRef={ref}
    {...rest}
  >
    <Icon type={icon} className={className || 'icon-link-icon'} />
    {children || text}
  </Link>
));

IconLink.propTypes = {
  icon: PropTypes.node.isRequired,
  link: PropTypes.string.isRequired,
  text: PropTypes.node.isRequired,
};

export default IconLink;
