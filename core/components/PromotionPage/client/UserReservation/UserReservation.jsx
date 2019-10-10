// @flow
import React from 'react';
import cx from 'classnames';

import T from '../../../Translation';
import PromotionReservationProgress from '../PromotionReservations/PromotionReservationProgress';
import PromotionReservationDeadline from '../PromotionReservations/PromotionReservationDeadline';

type UserReservationProps = {};

const UserReservation = ({
  promotionReservation,
  className,
  progressVariant,
}: UserReservationProps) => {
  const {
    expirationDate,
    promotionLot,
    startDate,
    status,
  } = promotionReservation;
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
        <PromotionReservationProgress
          promotionReservation={promotionReservation}
          variant={progressVariant}
        />
      </div>
    </div>
  );
};

export default UserReservation;
