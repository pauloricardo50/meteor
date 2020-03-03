import React from 'react';

import T from '../../../../components/Translation';
import PromotionReservationProgress from '../../../../components/PromotionPage/PromotionReservationProgress';
import PromotionOptionService from '../../../promotionOptions/server/PromotionOptionService';
import { proPromotionOption } from '../../../fragments';

const PromotionOptionProgress = ({ loan, promotionOption }) => (
  <div style={{ padding: 18, marginTop: 24 }}>
    <h2>
      <T id="PromotionReservationsTable.progress" />
    </h2>
    <PromotionReservationProgress
      promotionOption={promotionOption}
      style={{ flexDirection: 'column', alignItems: 'stretch' }}
      variant="text"
      className="full"
      loan={loan}
      withTooltip={false}
    />
  </div>
);

export default PromotionOptionProgress;

export const promotionOptionProgressStyles = `
  .hello {
    color: white;
  }
`;

export const getPromotionProgressData = ({ promotionOptionId }) => {
  const promotionOption = PromotionOptionService.get(
    promotionOptionId,
    proPromotionOption(),
  );

  return {
    promotionOption,
    loan: promotionOption.loan,
  };
};
