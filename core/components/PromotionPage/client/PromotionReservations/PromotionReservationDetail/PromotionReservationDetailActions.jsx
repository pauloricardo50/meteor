// @flow
import { Meteor } from 'meteor/meteor';
import React, { useContext } from 'react';
import { withProps } from 'recompose';

import {
  confirmPromotionLotBooking,
  sellPromotionLot,
  cancelPromotionLotBooking,
} from 'core/api/methods';
import { getPromotionCustomerOwnerType } from 'core/api/promotions/promotionClientHelpers';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import { isAllowedToBookPromotionLotToCustomer } from 'core/api/security/clientSecurityHelpers/index';
import Calculator from 'core/utils/Calculator';
import { PROMOTION_OPTION_STATUS } from '../../../../../api/promotionOptions/promotionOptionConstants';
import ConfirmMethod from '../../../../ConfirmMethod';
import PromotionLotReservationForm from '../../PromotionLotDetail/PromotionLotLoansTable/PromotionLotReservation/PromotionLotReservationForm';

type PromotionReservationDetailActionsProps = {};

const PromotionReservationDetailActions = ({
  promotionOption,
  agreementDuration,
  canActivateReservation,
  canReactivateReservation,
  canCancelReservation,
  canConfirmReservation,
  canSellLot,
  confirmReservationIsDisabled,
}: PromotionReservationDetailActionsProps) => {
  const { _id: promotionOptionId } = promotionOption;

  return (
    <div className="flex center mt-16">
      {canActivateReservation && (
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
      {canReactivateReservation && (
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
      {canConfirmReservation && (
        <ConfirmMethod
          buttonProps={{
            secondary: true,
            raised: true,
            disabled: confirmReservationIsDisabled,
            tooltip: confirmReservationIsDisabled
              ? 'Veuillez compléter toutes les étapes pour cette réservation'
              : undefined,
          }}
          label="Confirmer réservation"
          method={() => confirmPromotionLotBooking.run({ promotionOptionId })}
        />
      )}
      {canSellLot && (
        <ConfirmMethod
          buttonProps={{ secondary: true, raised: true }}
          label="Confirmer vente"
          method={() => sellPromotionLot.run({ promotionOptionId })}
        />
      )}
    </div>
  );
};

export default withProps(({ promotionOption }) => {
  const {
    status,
    promotion,
    loan: { promotions = [] },
  } = promotionOption;

  const { agreementDuration } = promotion;

  const [loanPromotion] = promotions;
  const {
    $metadata: { invitedBy },
  } = loanPromotion;

  const currentUser = useContext(CurrentUserContext);
  const customerOwnerType = getPromotionCustomerOwnerType({
    invitedBy,
    currentUser,
  });
  const isAllowedToBookLot = isAllowedToBookPromotionLotToCustomer({
    promotion,
    currentUser,
    customerOwnerType,
  });
  const isAdmin = Meteor.microservice === 'admin';

  const canReactivateReservation = [
    PROMOTION_OPTION_STATUS.RESERVATION_EXPIRED,
    PROMOTION_OPTION_STATUS.RESERVATION_CANCELLED,
    PROMOTION_OPTION_STATUS.RESERVATION_WAITLIST,
  ].includes(status) && isAllowedToBookLot;
  const canCancelReservation = [
    PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
    PROMOTION_OPTION_STATUS.RESERVED,
    PROMOTION_OPTION_STATUS.SOLD,
  ].includes(status) && isAdmin;
  const canActivateReservation = status === PROMOTION_OPTION_STATUS.RESERVATION_REQUESTED
    && isAllowedToBookLot;
  const canConfirmReservation = isAdmin && status === PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE;
  const canSellLot = isAdmin && status === PROMOTION_OPTION_STATUS.RESERVED;
  const confirmReservationIsDisabled = !Calculator.canConfirmPromotionLotBooking({ promotionOption });

  return {
    agreementDuration,
    canActivateReservation,
    canReactivateReservation,
    canCancelReservation,
    canConfirmReservation,
    canSellLot,
    confirmReservationIsDisabled,
  };
})(PromotionReservationDetailActions);
