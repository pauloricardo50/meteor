import React from 'react';

import T, { Money } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import { PROMOTION_LOTS_COLLECTION } from 'core/api/constants';
import { getPromotionLotValue } from 'core/components/PromotionPage/client/PromotionManagement/helpers';

const PromotionOptionDetail = ({ promotionOption, loanId }) => {
  const {
    _id: promotionOptionId,
    name,
    promotionLots,
    promotion,
    priority,
  } = promotionOption;
  const [{ reducedStatus }] = promotionLots;
  const promotionLotValue = getPromotionLotValue(promotionLots[0]);

  return (
    <div className="card1 card-hover promotion-option-detail">
      <h2>
        <span>{name}</span>
        <StatusLabel
          status={reducedStatus}
          collection={PROMOTION_LOTS_COLLECTION}
        />
      </h2>
      <h3 className="secondary">
        {typeof promotionLotValue === 'number' ? (
          <Money value={promotionLotValue} />
        ) : (
          promotionLotValue
        )}
      </h3>

      <h1>
        <T
          id="PromotionOptionDetail.priority"
          values={{ priority: priority + 1 }}
        />
      </h1>
    </div>
  );
};

export default PromotionOptionDetail;
