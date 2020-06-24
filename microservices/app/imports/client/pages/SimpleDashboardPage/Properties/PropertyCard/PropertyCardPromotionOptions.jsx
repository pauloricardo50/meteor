import React from 'react';

import { withPromotionPageContext } from 'core/components/PromotionPage/client/PromotionPageContext';
import UserPromotionOptionsTable from 'core/components/PromotionPage/client/UserPromotionOptionsTable';

const PropertyCardPromotionOptions = ({ loan }) => {
  if (!loan || !loan.promotionOptions) {
    return null;
  }

  return <UserPromotionOptionsTable loan={loan} isDashboardTable />;
};

export default withPromotionPageContext(({ loan }) => ({
  promotion: loan.promotions[0],
}))(PropertyCardPromotionOptions);
