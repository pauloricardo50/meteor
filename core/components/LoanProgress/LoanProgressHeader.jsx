//
import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks } from '@fortawesome/pro-light-svg-icons/faTasks';
import { faFile } from '@fortawesome/pro-light-svg-icons/faFile';
import Tooltip from '../Material/Tooltip';

import T from '../Translation';

const LoanProgressHeader = props => (
  <div className="loan-progress-header">
    <T id="PromotionLotLoansTable.loanProgress" />
    <div className="icons">
      <Tooltip title="Formulaires remplis" enterTouchDelay={0}>
        <FontAwesomeIcon icon={faTasks} className="icon" />
      </Tooltip>
      <Tooltip title="Documents uploadés" enterTouchDelay={0}>
        <FontAwesomeIcon icon={faFile} className="icon" />
      </Tooltip>
    </div>
  </div>
);

export default LoanProgressHeader;
