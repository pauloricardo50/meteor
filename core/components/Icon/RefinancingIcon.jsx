import React from 'react';
import { faDollarSign } from '@fortawesome/pro-light-svg-icons/faDollarSign';
import { faSync } from '@fortawesome/pro-light-svg-icons/faSync';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// TODO: Work in progress
const RefinancingIcon = ({ fontSize }) => (
  <span className="fa-layers fa-fw" style={{ fontSize }}>
    <FontAwesomeIcon icon={faSync} transform="rotate-25 shrink-1" />
    <FontAwesomeIcon icon={faDollarSign} transform="shrink-5" />
  </span>
);

export default RefinancingIcon;
