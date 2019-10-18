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
          />
        </div>
        {status === PROMOTION_OPTION_STATUS.ACTIVE && (
          <PromotionReservationProgress
            promotionOption={promotionOption}
            variant={progressVariant}
          />
        )}
      </div>
    </div>
  );
};

export default UserReservation;
