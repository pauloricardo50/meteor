import React from 'react';
import moment from 'moment';

import { PROMOTION_OPTION_ICONS } from '../../../../components/PromotionPage/PromotionReservationProgress/promotionReservationProgressHelperz';
import T from '../../../../components/Translation';
import colors from '../../../../config/colors';
import { setupMoment } from '../../../../utils/localization';
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
  color: overrideColor,
}) => {
  const config = PROMOTION_OPTION_ICONS[id]?.({
    ...promotionOption,
    ...promotionOption.loan?.loanProgress,
  });
  const {
    description = overrideDescription,
    color = overrideColor,
    date = overrideDate,
  } = config || {};

  return (
    <li style={{ marginBottom: 8 }}>
      <div>
        <T id={`Forms.${id}`} />
      </div>
      <div>
        <span style={{ color }}>{description}</span>
        {date && (
          <>
            &nbsp;–&nbsp;
            <small>
              {/* If you just use fromNow() the delta is off by our UTC offset... */}
              {moment(date).from(new Date())}
            </small>
          </>
        )}
      </div>
    </li>
  );
};

const EmailPromotionOptionProgress = ({ promotionOptionId, anonymize }) => {
  const promotionOption = getPromotionProgressData(promotionOptionId);
  const { loan } = promotionOption;
  setupMoment();

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
        {!anonymize && (
          <>
            <br />
            <Item
              id="proNote"
              promotionOption={promotionOption}
              description={loan?.proNote?.note || 'Pas de commentaire'}
              date={loan?.proNote?.date}
              color={colors.iconHoverColor}
            />
          </>
        )}
      </ul>
    </div>
  );
};

export default EmailPromotionOptionProgress;
