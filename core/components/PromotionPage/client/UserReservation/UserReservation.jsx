import React from 'react';
import cx from 'classnames';

import { PROMOTION_OPTION_STATUS } from '../../../../api/promotionOptions/promotionOptionConstants';
import T from '../../../Translation';
import PromotionReservationProgress from '../../PromotionReservationProgress';
import PromotionReservationDeadline from '../PromotionReservations/PromotionReservationDeadline';

const UserReservation = ({
  promotionOption,
  className,
  progressVariant,
  loan,
}) => {
  const {
    reservationAgreement: { expirationDate, startDate },
    status,
    name,
  } = promotionOption;
  return (
    <div className={cx('user-reservation', className)}>
      <h3>
        <T id="UserReservation.title" values={{ promotionLotName: name }} />
      </h3>

      <div className="user-reservation-info">
        <div className="user-reservation-deadline">
          <PromotionReservationDeadline
            startDate={startDate}
            expirationDate={expirationDate}
            status={status}
            promotionOption={promotionOption}
            loan={loan}
          />
        </div>
        {[
          PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
          PROMOTION_OPTION_STATUS.RESERVED,
          PROMOTION_OPTION_STATUS.RESERVATION_WAITLIST,
        ].includes(status) && (
          <PromotionReservationProgress
            promotionOption={promotionOption}
            variant={progressVariant}
            loan={loan}
            showLoanProgress
            showLabels={progressVariant === 'text'}
            showDetailIcon
          />
        )}
      </div>
    </div>
  );
};

export default UserReservation;
