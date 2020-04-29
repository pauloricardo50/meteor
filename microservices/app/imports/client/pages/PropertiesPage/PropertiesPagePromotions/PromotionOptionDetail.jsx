import React from 'react';

import { PROMOTION_LOTS_COLLECTION } from 'core/api/promotionLots/promotionLotConstants';
import { getPromotionLotValue } from 'core/components/PromotionPage/client/PromotionManagement/helpers';
import StatusLabel from 'core/components/StatusLabel';
import T, { Money } from 'core/components/Translation';

const PromotionOptionDetail = ({
  promotionOption: { name, promotionLots, priority },
}) => {
  const [{ reducedStatus }] = promotionLots;
  const promotionLotValue = getPromotionLotValue(promotionLots[0]);

  return (
    <div className="card1 card-hover promotion-option-detail">
      <h2>
        <span className="mr-8">
          <T id="PromotionOptionDetail.title" values={{ name }} />
        </span>
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

      <h4 className="priority font-size-2">
        <T
          id="PromotionOptionDetail.priority"
          values={{ priority: priority + 1 }}
        />
      </h4>
    </div>
  );
};

export default PromotionOptionDetail;
