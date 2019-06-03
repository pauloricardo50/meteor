import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from '../Icon';
import Link from '../Link';

const IconLink = React.forwardRef((
  {
    link,
    icon,
    text,
    children,
    className,
    stopPropagation = true,
    iconClassName,
    ...rest
  },
  ref,
) => (
  <Link
    to={link}
    className={cx('icon-link', iconClassName)}
    onClick={(e) => {
      if (stopPropagation) {
        e.stopPropagation();
      }
    }}
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
