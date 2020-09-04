import React from 'react';

import { withPromotionPageContext } from 'core/components/PromotionPage/client/PromotionPageContext';
import UserReservation from 'core/components/PromotionPage/client/UserReservation';
import Calculator from 'core/utils/Calculator';

const OnboardingPromotionReservation = ({ loan }) => (
  <div className="flex-col center p-16">
    <UserReservation
      promotionOption={Calculator.getMostActivePromotionOption({ loan })}
      progressVariant="icon"
      loan={loan}
    />
  </div>
);

export default withPromotionPageContext(({ loan }) => ({
  promotion: loan.promotions[0],
}))(OnboardingPromotionReservation);
