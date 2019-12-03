// @flow
import React from 'react';
import cx from 'classnames';

import { PROMOTION_OPTION_STATUS } from 'core/api/constants';
import T from '../../../Translation';
import PromotionReservationProgress from '../PromotionReservations/PromotionReservationProgress';
import PromotionReservationDeadline from '../PromotionReservations/PromotionReservationDeadline';

type UserReservationProps = {};

const UserReservation = ({
  promotionOption,
  className,
  progressVariant,
  loan,
}: UserReservationProps) => {
  const {
    reservationAgreement: { expirationDate, startDate },
    promotionLots,
    status,
  } = promotionOption;
  const [promotionLot] = promotionLots;
  return (
    <div className={cx('user-reservation', className)}>
      <h3>
        <T
          id="UserReservation.title"
          values={{ promotionLotName: promotionLot.name }}
        />
      </h3>

      <div className="user-reservation-info">
        <div className="user-reservation-deadline">
          <PromotionReservationDeadline
            startDate={startDate}
            expirationDate={expirationDate}
            status={status}
            promotionOption={promotionOption}
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
          />
        )}
      </div>
    </div>
  );
};

export default UserReservation;
