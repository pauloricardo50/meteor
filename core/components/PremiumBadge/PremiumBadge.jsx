import React from 'react';
import cx from 'classnames';

const PremiumBadge = ({
  small = false,
  Component = small ? 'small' : 'span',
}) => <Component className={cx('premium-badge', { small })}>Premium</Component>;

export default PremiumBadge;
