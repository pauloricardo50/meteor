import React from 'react';

import { getPromotionLotValue } from 'core/components/PromotionPage/client/PromotionManagement/helpers';
import StatusLabel from 'core/components/StatusLabel';
import T, { Money } from 'core/components/Translation';

const PromotionOptionDetail = ({
  promotionOption: { name, promotionLots, priorityOrder },
}) => {
  const [{ reducedStatus, _collection }] = promotionLots;
  const promotionLotValue = getPromotionLotValue(promotionLots[0]);

  return (
    <div className="card1 card-hover promotion-option-detail">
      <h2>
        <span className="mr-8">
          <T id="PromotionOptionDetail.title" values={{ name }} />
        </span>
        <StatusLabel status={reducedStatus} collection={_collection} />
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
          values={{ priority: priorityOrder + 1 }}
        />
      </h4>
    </div>
  );
};

export default PromotionOptionDetail;
