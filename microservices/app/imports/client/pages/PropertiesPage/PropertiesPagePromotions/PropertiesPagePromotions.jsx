import React from 'react';

import T from 'core/components/Translation';

import PromotionDetail from './PromotionDetail';
import PromotionOptionDetail from './PromotionOptionDetail';

const PropertiesPagePromotions = ({
  loan: { _id: loanId, promotions, promotionOptions },
}) => (
  <div className="promotions">
    <div className="promotion-cards">
      {promotions &&
        promotions.map(promotion => (
          <PromotionDetail
            promotion={promotion}
            loanId={loanId}
            key={promotion._id}
          />
        ))}
    </div>

    {promotionOptions.length > 0 && (
      <>
        <hr />
        <h2 className="text-center">
          <T id="collections.promotionOptions" />
        </h2>
      </>
    )}

    <div className="promotion-options">
      {promotionOptions
        .sort(
          ({ priorityOrder: priority1 }, { priorityOrder: priority2 }) =>
            priority1 - priority2,
        )
        .map(promotionOption => (
          <PromotionOptionDetail
            promotionOption={promotionOption}
            key={promotionOption._id}
          />
        ))}
    </div>
  </div>
);

export default PropertiesPagePromotions;
