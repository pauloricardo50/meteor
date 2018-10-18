// @flow
import React from 'react';

import { Percent } from 'core/components/Translation';
import Icon from 'core/components/Icon';
import Tooltip from 'core/components/Material/Tooltip';
// import { LOAN_VERIFICATION_STATUS } from 'core/api/constants';

type PromotionProgressProps = {};

const getIcon = (status) => {
  switch (status) {
  // case LOAN_VERIFICATION_STATUS.NONE:
  //   return 'close';
  // case LOAN_VERIFICATION_STATUS.OK:
  //   return 'check';
  // case LOAN_VERIFICATION_STATUS.ERROR:
  //   return 'close';
  // case LOAN_VERIFICATION_STATUS.NONE:
  //   return 'close';

  default:
    return 'close';
  }
};

const PromotionProgress = ({
  promotionProgress: { info, documents, verificationStatus },
}: PromotionProgressProps) => (
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

    <Tooltip title="Vérifié par e-Potek">
      <Icon type={getIcon(verificationStatus)} />
    </Tooltip>
  </div>
);

export default PromotionProgress;
