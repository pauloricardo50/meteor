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
    iconStyle,
    showIcon,
    noRoute,
    ...rest
  },
  ref,
) => {
  let Component = Link;
  let props = {
    to: link,
    innerRef: ref,
  };

  if (noRoute) {
    Component = 'div';
    props = {
      ref,
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (rest.showPopover && rest.onMouseLeave) {
          rest.onMouseLeave();
        } else if (rest.onMouseEnter) {
          rest.onMouseEnter();
        }
      },
    };
  }

  return (
    <Component
      className={cx('icon-link', iconClassName)}
      onClick={(e) => {
        if (stopPropagation) {
          e.stopPropagation();
        }
      }}
      style={iconStyle}
      {...props}
      {...rest}
    >
      {showIcon && (
        <Icon type={icon} className={className || 'icon-link-icon'} />
      )}
      {children || (typeof text === 'string' ? <span>{text}</span> : text)}
    </Component>
  );
});

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
