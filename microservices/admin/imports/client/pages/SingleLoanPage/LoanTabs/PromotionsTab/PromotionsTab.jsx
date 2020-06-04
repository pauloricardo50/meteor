import React from 'react';
import merge from 'lodash/merge';

import { formPromotionOption } from 'core/api/fragments';
import { PROMOTION_OPTIONS_COLLECTION } from 'core/api/promotionOptions/promotionOptionConstants';
import { CollectionIconLink } from 'core/components/IconLink';
import Loading from 'core/components/Loading';
import UserPromotionOptionsTable from 'core/components/PromotionPage/client/UserPromotionOptionsTable';
import useMeteorData from 'core/hooks/useMeteorData';

const PromotionsTab = ({ loan }) => {
  const [promotion] = loan.promotions;
  const { data: promotionOptions, isInitialLoad } = useMeteorData({
    query: PROMOTION_OPTIONS_COLLECTION,
    params: {
      $filters: { 'loanCache._id': loan._id },
      ...merge({}, formPromotionOption(), {
        promotionLots: { name: 1, value: 1 },
        loanCache: 1,
      }),
    },
  });

  if (isInitialLoad) {
    return <Loading />;
  }

  return (
    <>
      <h2>
        <CollectionIconLink
          relatedDoc={promotion}
          iconStyle={{ maxWidth: 'unset' }}
        />
      </h2>
      <UserPromotionOptionsTable
        loan={loan}
        promotionOptions={promotionOptions}
        promotion={promotion}
        isAdmin
      />
    </>
  );
};

export default PromotionsTab;
