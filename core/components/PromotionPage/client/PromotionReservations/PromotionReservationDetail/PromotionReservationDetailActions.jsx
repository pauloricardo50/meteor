// @flow
import React from 'react';

import {
  bookPromotionLot,
  sellPromotionLot,
  cancelPromotionLotBooking,
} from 'core/api/methods';
import { PROMOTION_OPTION_STATUS } from '../../../../../api/promotionOptions/promotionOptionConstants';
import ConfirmMethod from '../../../../ConfirmMethod';
import PromotionLotReservationForm from '../../PromotionLotDetail/PromotionLotLoansTable/PromotionLotReservation/PromotionLotReservationForm';

type PromotionReservationDetailActionsProps = {};

const PromotionReservationDetailActions = ({
  promotionOption,
}: PromotionReservationDetailActionsProps) => {
  const {
    _id: promotionOptionId,
    status,
    promotion: { agreementDuration },
  } = promotionOption;
  const isDeadReservation = [
    PROMOTION_OPTION_STATUS.RESERVATION_EXPIRED,
    PROMOTION_OPTION_STATUS.RESERVATION_CANCELLED,
    PROMOTION_OPTION_STATUS.RESERVATION_WAITLIST,
  ].includes(status);
  const canCancelReservation = [
    PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
    PROMOTION_OPTION_STATUS.RESERVED,
    PROMOTION_OPTION_STATUS.SOLD,
  ].includes(status);
  const hasRequestedReservation = status === PROMOTION_OPTION_STATUS.RESERVATION_REQUESTED;

  return (
    <div className="flex center mt-16">
      {hasRequestedReservation && (
        <PromotionLotReservationForm
          agreementDuration={agreementDuration}
          promotionOption={promotionOption}
          buttonProps={{
            className: 'mr-8',
            primary: true,
            raised: true,
            label: 'Démarrer réservation',
          }}
        />
      )}
      {canCancelReservation && (
        <ConfirmMethod
          buttonProps={{ className: 'mr-8', error: true, outlined: true }}
          label="Annuler réservation"
          method={() => cancelPromotionLotBooking.run({ promotionOptionId })}
        />
      )}
      {isDeadReservation && (
        <PromotionLotReservationForm
          agreementDuration={agreementDuration}
          promotionOption={promotionOption}
          buttonProps={{
            className: 'mr-8',
            primary: true,
            raised: true,
            label: 'Réactiver réservation',
          }}
        />
      )}
      {status === PROMOTION_OPTION_STATUS.ACTIVE && (
        <ConfirmMethod
          buttonProps={{ secondary: true, raised: true }}
          label="Confirmer vente"
          method={() => sellPromotionLot.run({ promotionOptionId })}
        />
      )}
    </div>
  );
};

export default PromotionReservationDetailActions;
