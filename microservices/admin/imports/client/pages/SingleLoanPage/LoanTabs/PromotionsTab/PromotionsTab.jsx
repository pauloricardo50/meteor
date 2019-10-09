// @flow
import React from 'react';

import UserPromotionOptionsTable from 'core/components/PromotionPage/client/UserPromotionOptionsTable';
import PromotionReservationsTable from 'core/components/PromotionPage/client/PromotionReservationsTable';
import { CollectionIconLink } from 'core/components/IconLink';
import { PROMOTIONS_COLLECTION } from 'core/api/constants';

type PromotionsTabProps = {};

const PromotionsTab = ({ loan }: PromotionsTabProps) => {
  const [promotion] = loan.promotions;

  return (
    <>
      <h2>
        <CollectionIconLink
          relatedDoc={{ ...promotion, collection: PROMOTIONS_COLLECTION }}
          iconStyle={{ maxWidth: 'unset' }}
        />
      </h2>
      <br />
      <PromotionReservationsTable
        promotionId={promotion._id}
        loanId={loan._id}
      />
      <br />
      <UserPromotionOptionsTable loan={loan} promotion={promotion} isAdmin />
    </>
  );
};

export default PromotionsTab;
