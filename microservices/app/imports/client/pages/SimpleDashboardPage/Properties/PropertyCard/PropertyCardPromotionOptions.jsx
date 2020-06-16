import React from 'react';
import { compose, withProps } from 'recompose';

import { withPromotionPageContext } from 'core/components/PromotionPage/client/PromotionPageContext';
import UserPromotionOptionsTable from 'core/components/PromotionPage/client/UserPromotionOptionsTable';

const PropertyCardPromotionOptions = ({ loan }) => {
  if (!loan || !loan.promotionOptions) {
    return null;
  }

  return <UserPromotionOptionsTable loan={loan} isDashboardTable />;
};

export default compose(
  withProps(({ loan }) => ({ promotion: loan.promotions[0] })),
  withPromotionPageContext(),
)(PropertyCardPromotionOptions);
