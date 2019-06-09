// @flow
import React from 'react';

import UserPromotionOptionsTable from 'core/components/PromotionPage/client/UserPromotionOptionsTable';

type PropertyCardPromotionOptionsProps = {};

const PropertyCardPromotionOptions = ({
  document,
  loan,
}: PropertyCardPromotionOptionsProps) => {
  if (!loan || !loan.promotionOptions) {
    return null;
  }

  return (
    <UserPromotionOptionsTable
      promotion={document}
      loan={loan}
      isDashboardTable
    />
  );
};

export default PropertyCardPromotionOptions;
