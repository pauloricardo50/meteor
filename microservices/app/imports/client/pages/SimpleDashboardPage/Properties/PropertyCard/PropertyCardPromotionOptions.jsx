//      
import React from 'react';

import UserPromotionOptionsTable from 'core/components/PromotionPage/client/UserPromotionOptionsTable';

                                            

const PropertyCardPromotionOptions = ({
  document,
  loan,
}                                   ) => {
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
