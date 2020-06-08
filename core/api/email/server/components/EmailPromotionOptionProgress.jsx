import React from 'react';
import moment from 'moment';

import { PROMOTION_OPTION_ICONS } from '../../../../components/PromotionPage/PromotionReservationProgress/promotionReservationProgressHelpers';
import T from '../../../../components/Translation';
import PromotionOptionService from '../../../promotionOptions/server/PromotionOptionService';

export const promotionOptionProgressStyles = `
  .secondary {
    opacity: 0.5;
  }
`;

const getPromotionProgressData = promotionOptionId =>
  PromotionOptionService.get(promotionOptionId, {
    simpleVerification: 1,
    fullVerification: 1,
    bank: 1,
    reservationAgreement: 1,
    reservationDeposit: 1,
    loan: {
      proNote: 1,
      loanProgress: 1,
    },
  });

const Item = ({
  id,
  promotionOption,
  description: overrideDescription,
  date: overrideDate,
}) => {
  const config = PROMOTION_OPTION_ICONS[id]?.({
    ...promotionOption,
    ...promotionOption.loan?.loanProgress,
  });
  const { description = overrideDescription, color, date = overrideDate } =
    config || {};

  return (
    <li>
      <div>
        <T id={`Forms.${id}`} />
      </div>
      <div>
        <br />
        <span style={{ color }}>{description}</span>
        {date && (
          <>
            &nbsp;–&nbsp;
            <small>{moment(date).fromNow()}</small>
          </>
        )}
      </div>
    </li>
  );
};

const EmailPromotionOptionProgress = ({ promotionOptionId }) => {
  const promotionOption = getPromotionProgressData(promotionOptionId);
  const { loan } = promotionOption;
  console.log('loan:', loan);
  return (
    <div style={{ padding: 18, marginTop: 24 }}>
      <h2>
        <T id="PromotionOptionProgress.title" />
      </h2>

      <ul>
        <Item id="simpleVerification" promotionOption={promotionOption} />
        <Item id="info" promotionOption={promotionOption} />
        <Item id="documents" promotionOption={promotionOption} />
        <Item id="fullVerification" promotionOption={promotionOption} />
        <Item id="bank" promotionOption={promotionOption} />
        <br />
        <Item id="reservationAgreement" promotionOption={promotionOption} />
        <Item id="reservationDeposit" promotionOption={promotionOption} />
        <br />
        <Item
          id="proNote"
          promotionOption={promotionOption}
          description={loan?.proNote?.note || 'Pas de commentaire'}
          date={loan?.proNote?.date}
        />
      </ul>
    </div>
  );
};

export default EmailPromotionOptionProgress;
