import React from 'react';
import { faHomeLg } from '@fortawesome/pro-light-svg-icons/faHomeLg';
import { faPlus } from '@fortawesome/pro-light-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// TODO: Work in progress
const AcquisitionIcon = ({ fontSize }) => (
  <span className="fa-layers fa-fw" style={{ fontSize }}>
    <FontAwesomeIcon icon={faHomeLg} transform="shrink-3 down-2 left-2" />
    <FontAwesomeIcon icon={faPlus} inverse transform="shrink-6 up-5 right-6" />
  </span>
);

export default AcquisitionIcon;
