import React from 'react';

import T from '../../../../components/Translation';
import PromotionReservationProgress from '../../../../components/PromotionPage/PromotionReservationProgress';
import colors from '../../../../config/colors';
import PromotionOptionService from '../../../promotionOptions/server/PromotionOptionService';
import { getPromotionReservationIcon } from '../../../../components/PromotionPage/PromotionReservationProgress/PromotionReservationProgressHelpers';
import { proPromotionOption } from '../../../fragments';

export const promotionOptionProgressStyles = `
  .secondary {
    opacity: 0.5;
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
      withIcon={false}
      renderStatus={({ id, note, placeholder, status }) => {
        const { color = 'primary' } =
          getPromotionReservationIcon(id, status) || {};

        return (
          <span style={{ color: colors[color] }}>
            <br />
            <span>
              {note || placeholder || <T id={`Forms.status.${status}`} />}
            </span>
          </span>
        );
      }}
    />
  </div>
);

export default PromotionOptionProgress;
