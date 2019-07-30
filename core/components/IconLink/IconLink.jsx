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
    showIcon,
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
    {showIcon && (
      <Icon type={icon} className={className || 'icon-link-icon'} />
    )}
    {children || (typeof text === 'string' ? <span>{text}</span> : text)}
  </Link>
));

IconLink.propTypes = {
  icon: PropTypes.node.isRequired,
  link: PropTypes.string.isRequired,
  showIcon: PropTypes.bool,
  text: PropTypes.node.isRequired,
};

IconLink.defaultProps = {
  showIcon: true,
};

export default IconLink;
