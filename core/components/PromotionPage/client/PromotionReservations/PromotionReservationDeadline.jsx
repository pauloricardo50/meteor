// @flow
import React from 'react';
import moment from 'moment';
import cx from 'classnames';

import { PROMOTION_RESERVATION_STATUS } from '../../../../api/promotionReservations/promotionReservationConstants';
import Tooltip from '../../../Material/Tooltip';
import T from '../../../Translation';

type PromotionReservationDeadlineProps = {};

const PromotionReservationDeadline = ({
  expirationDate,
  status,
}: PromotionReservationDeadlineProps) => {
  const inThreeDays = moment().add(3, 'd');
  const momentDate = moment(expirationDate);
  const isTight = inThreeDays.isAfter(momentDate);

  if (status === PROMOTION_RESERVATION_STATUS.ACTIVE) {
    return (
      <label htmlFor="expirationDate">
        <T id="Forms.expirationDate" />
        <Tooltip title={momentDate.format('D MMMM YYYY')}>
          <h1 className={cx({ 'error-box': isTight })}>
            {momentDate.fromNow()}
          </h1>
        </Tooltip>
      </label>
    );
  }

  if (status === PROMOTION_RESERVATION_STATUS.WAITLIST) {
    return (
      <div>
        <h1>
          <T id="PromotionReservationDeadline.waitlist" />
        </h1>
        <T id="PromotionReservationDeadline.waitlist.description" />
      </div>
    );
  }

  if (status === PROMOTION_RESERVATION_STATUS.CANCELED) {
    return (
      <div>
        <h1>
          <T id="PromotionReservationDeadline.canceled" />
        </h1>
        <T id="PromotionReservationDeadline.canceled.description" />
      </div>
    );
  }

  if (status === PROMOTION_RESERVATION_STATUS.COMPLETED) {
    return (
      <div>
        <h1>
          <T id="PromotionReservationDeadline.completed" />
        </h1>
        <T id="PromotionReservationDeadline.completed.description" />
      </div>
    );
  }
};

export default PromotionReservationDeadline;
