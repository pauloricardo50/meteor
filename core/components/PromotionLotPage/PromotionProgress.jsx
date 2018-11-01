// @flow
import React from 'react';

import { Percent } from 'core/components/Translation';
import Icon from 'core/components/Icon';
import Tooltip from 'core/components/Material/Tooltip';
import { LOAN_VERIFICATION_STATUS } from 'core/api/constants';

type PromotionProgressProps = {};

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
    return { icon: 'close', text: 'Vérification pas demandée' };
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

const PromotionProgress = ({
  promotionProgress: { info, documents, verificationStatus },
}: PromotionProgressProps) => {
  const { icon, text, className = '' } = getVerificationData(verificationStatus);
  return (
    <div className="promotion-progress">
      <Tooltip title="Formulaires remplis">
        <span>
          <Percent value={info} rounded />
        </span>
      </Tooltip>

      <Tooltip title="Documents uploadés">
        <span>
          <Percent value={documents} rounded />
        </span>
      </Tooltip>

      <Tooltip title={text}>
        <Icon type={icon} className={className} />
      </Tooltip>
    </div>
  );
};

export default PromotionProgress;
