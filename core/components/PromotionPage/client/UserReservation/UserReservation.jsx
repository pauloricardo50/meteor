import React from 'react';
import cx from 'classnames';

import useMedia from 'core/hooks/useMedia';

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
  const isSmallMobile = useMedia({ maxWidth: 768 });

  return (
    <div className={cx('user-reservation', className)}>
      <h3>
        <T
          values={{ promotionLotName: name }}
          defaultMessage="Lot {promotionLotName}"
        />
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
            loan={loan}
            showLoanProgress
            showLabels={progressVariant === 'text' || isSmallMobile}
            showDetailIcon={!isSmallMobile}
            vertical={isSmallMobile}
          />
        )}
      </div>
    </div>
  );
};

export default UserReservation;
