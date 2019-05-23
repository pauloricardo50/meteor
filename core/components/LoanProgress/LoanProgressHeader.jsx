// @flow
import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks } from '@fortawesome/pro-light-svg-icons/faTasks';
import { faFile } from '@fortawesome/pro-light-svg-icons/faFile';
import { faEye } from '@fortawesome/pro-light-svg-icons/faEye';
import Tooltip from '../Material/Tooltip';

import Icon from '../Icon';

import T from '../Translation';

type LoanProgressHeaderProps = {};

const LoanProgressHeader = (props: LoanProgressHeaderProps) => (
  <div className="loan-progress-header">
    <T id="PromotionLotLoansTable.loanProgress" />
    <div className="icons">
      <Tooltip title="Formulaires remplis" enterTouchDelay={0}>
        <FontAwesomeIcon icon={faTasks} className="icon" />
      </Tooltip>
      <Tooltip title="Documents uploadés" enterTouchDelay={0}>
        <FontAwesomeIcon icon={faFile} className="icon" />
      </Tooltip>

      <Tooltip title="Statut de la vérification e-Potek" enterTouchDelay={0}>
        <FontAwesomeIcon icon={faEye} className="icon" />
      </Tooltip>

      {/* <Icon type="info" tooltip="Formulaires remplis" /> */}
      {/* <Icon type="attachFile" tooltip="Documents uploadés" /> */}
      {/* <Icon type="eye" tooltip="Statut de la vérification e-Potek" /> */}
    </div>
  </div>
);

export default LoanProgressHeader;
