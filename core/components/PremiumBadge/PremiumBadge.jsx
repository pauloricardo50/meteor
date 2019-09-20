// @flow
import React from 'react';
import cx from 'classnames';

type PremiumBadgeProps = {
  small: Boolean,
};

const PremiumBadge = ({ small = false }: PremiumBadgeProps) => (
  <span className={cx('premium-badge', { small })}>Premium</span>
);

export default PremiumBadge;
