// @flow
import React from 'react';
import moment from 'moment';

import T from '../../../Translation';
import PromotionReservationProgress from '../PromotionReservationsTable/PromotionReservationProgress';

type UserReservationProps = {};

const UserReservation = ({ promotionReservation }: UserReservationProps) => {
  const { promotionLot, expirationDate } = promotionReservation;
  return (
    <div className="user-reservation card1 card-top">
      <h3>
        <T
          id="UserReservation.title"
          values={{ promotionLotName: promotionLot.name }}
        />
      </h3>

      <div className="user-reservation-info">
        <div className="user-reservation-deadline">
          <label htmlFor="">
            <T id="Forms.expirationDate" />
            <h1>{moment(expirationDate).fromNow()}</h1>
          </label>
        </div>
        <PromotionReservationProgress
          promotionReservation={promotionReservation}
          showText
        />
      </div>
    </div>
  );
};

export default UserReservation;
