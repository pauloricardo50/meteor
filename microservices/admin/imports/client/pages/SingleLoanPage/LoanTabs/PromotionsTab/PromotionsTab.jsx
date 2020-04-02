import React from 'react';

import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { CollectionIconLink } from 'core/components/IconLink';
import UserPromotionOptionsTable from 'core/components/PromotionPage/client/UserPromotionOptionsTable';

const PromotionsTab = ({ loan }) => {
  const [promotion] = loan.promotions;

  return (
    <>
      <h2>
        <CollectionIconLink
          relatedDoc={{ ...promotion, collection: PROMOTIONS_COLLECTION }}
          iconStyle={{ maxWidth: 'unset' }}
        />
      </h2>
      <UserPromotionOptionsTable loan={loan} promotion={promotion} isAdmin />
    </>
  );
};

export default PromotionsTab;
