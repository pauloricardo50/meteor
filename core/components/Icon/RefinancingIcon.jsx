import React from 'react';
import { faDollarSign } from '@fortawesome/pro-light-svg-icons/faDollarSign';
import { faSync } from '@fortawesome/pro-light-svg-icons/faSync';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

const RefinancingIcon = ({ fontSize, className, style }) => (
  <span
    className={cx('fa-layers fa-fw', className)}
    style={{ fontSize, ...style }}
  >
    <FontAwesomeIcon icon={faSync} transform="rotate-25 shrink-1" />
    <FontAwesomeIcon icon={faDollarSign} transform="shrink-5" />
  </span>
);

export default RefinancingIcon;
