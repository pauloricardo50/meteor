// @flow
import React from 'react';

import { LOAN_VERIFICATION_STATUS } from '../../api/constants';
import Icon from '../Icon';
import Tooltip from '../Material/Tooltip';
import ProgressCircle from '../ProgressCircle';

type LoanProgressProps = {
  loanProgress: Object,
};

const getVerificationData = (status) => {
  switch (status) {
  case LOAN_VERIFICATION_STATUS.OK:
    return {
      icon: 'check',
      className: 'success',
      text: 'Vérification réussie',
    };
  case LOAN_VERIFICATION_STATUS.ERROR:
    return {
      icon: 'close',
      className: 'error',
      text: 'Vérification échouée',
    };
  case LOAN_VERIFICATION_STATUS.NONE:
    return {
      icon: 'help',
      className: 'secondary',
      text: 'Vérification pas demandée',
    };
  case LOAN_VERIFICATION_STATUS.REQUESTED:
    return {
      icon: 'waiting',
      className: 'warning',
      text: 'Vérification demandée',
    };

  default:
    return { icon: 'close', text: 'Vérification pas demandée' };
  }
};

const LoanProgress = ({
  loanProgress: { info, documents, verificationStatus },
}: LoanProgressProps) => {
  const { icon, text, className = '' } = getVerificationData(verificationStatus);
  return (
    <div className="promotion-progress">
      <ProgressCircle
        percent={info}
        options={{ squareSize: 24, strokeWidth: 5, animated: true }}
      />
      <ProgressCircle
        percent={documents}
        options={{ squareSize: 24, strokeWidth: 5, animated: true }}
      />
      <Tooltip title={text} enterTouchDelay={0}>
        <Icon type={icon} className={className} />
      </Tooltip>
    </div>
  );
};

export default LoanProgress;
