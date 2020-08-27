import React from 'react';

import { PROMOTION_OPTIONS_COLLECTION } from 'core/api/promotionOptions/promotionOptionConstants';
import { CollectionIconLink } from 'core/components/IconLink';
import Chip from 'core/components/Material/Chip';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';
import Calculator from 'core/utils/Calculator';

const SingleLoanPageHeaderPromotion = ({ loan }) => {
  const promotionOption = Calculator.getMostActivePromotionOption({ loan });

  return (
    <div className="flex center">
      <CollectionIconLink relatedDoc={loan.promotions[0]} />
      {promotionOption && (
        <Chip
          className="ml-4"
          label={
            <div>
              {promotionOption.name}{' '}
              <StatusLabel
                status={promotionOption.status}
                collection={PROMOTION_OPTIONS_COLLECTION}
              />
            </div>
          }
        />
      )}
    </div>
  );
};

export default SingleLoanPageHeaderPromotion;
