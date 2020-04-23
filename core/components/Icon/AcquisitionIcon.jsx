import React from 'react';
import { faHomeLg } from '@fortawesome/pro-light-svg-icons/faHomeLg';
import { faPlus } from '@fortawesome/pro-light-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

const AcquisitionIcon = ({ fontSize, className, style }) => (
  <span
    className={cx('fa-layers fa-fw', className)}
    style={{ fontSize, ...style }}
  >
    <FontAwesomeIcon icon={faHomeLg} transform="shrink-3 down-2 left-2" />
    <FontAwesomeIcon icon={faPlus} transform="shrink-6 up-5 right-6" />
  </span>
);

export default AcquisitionIcon;
