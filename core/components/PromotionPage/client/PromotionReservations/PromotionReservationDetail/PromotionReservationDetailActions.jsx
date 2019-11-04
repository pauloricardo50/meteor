// @flow
import { Meteor } from 'meteor/meteor';
import React, { useContext } from 'react';
import { withProps } from 'recompose';

import {
  confirmPromotionLotReservation,
  sellPromotionLot,
  cancelPromotionLotReservation,
} from 'core/api/methods';
import { getPromotionCustomerOwnerType } from 'core/api/promotions/promotionClientHelpers';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import { isAllowedToManageCustomerPromotionReservation } from 'core/api/security/clientSecurityHelpers/index';
import Calculator from 'core/utils/Calculator';
import {
  PROMOTION_OPTION_STATUS,
  PROMOTION_OPTION_AGREEMENT_STATUS,
} from '../../../../../api/promotionOptions/promotionOptionConstants';
import ConfirmMethod from '../../../../ConfirmMethod';
import PromotionLotReservationForm from '../../PromotionLotDetail/PromotionLotLoansTable/PromotionLotReservation/PromotionLotReservationForm';

type PromotionReservationDetailActionsProps = {};

const PromotionReservationDetailActions = ({
  promotionOption,
  agreementDuration,
  canUploadReservationAgreement,
  canReactivateReservation,
  canCancelReservation,
  canConfirmReservation,
  canSellLot,
  confirmReservationIsDisabled,
}: PromotionReservationDetailActionsProps) => {
  const { _id: promotionOptionId } = promotionOption;

  return (
    <div className="flex center mt-16">
      {canUploadReservationAgreement && (
        <PromotionLotReservationForm
          agreementDuration={agreementDuration}
          promotionOption={promotionOption}
          buttonProps={{
            className: 'mr-8',
            primary: true,
            raised: true,
            label: 'Uploader convention de réservation',
          }}
        />
      )}
      {canCancelReservation && (
        <ConfirmMethod
          buttonProps={{ className: 'mr-8', error: true, outlined: true }}
          label="Annuler réservation"
          method={() =>
            cancelPromotionLotReservation.run({ promotionOptionId })
          }
          description={(
            <span>
              Ce lot deviendra a nouveau disponible.
              <br />
              Notifiera tous les Pros par email.
            </span>
          )}
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
          method={() =>
            confirmPromotionLotReservation.run({ promotionOptionId })
          }
          description={(
            <span>
              Vous confirmez que ce lot est maintenant réservé pour ce client?
              <br />
              Notifiera tous les Pros par email.
            </span>
          )}
        />
      )}
      {canSellLot && (
        <ConfirmMethod
          buttonProps={{ secondary: true, raised: true }}
          label="Confirmer vente"
          method={() => sellPromotionLot.run({ promotionOptionId })}
          description={(
            <span>
              Vous confirmez que le client a signé le contrat de la banque, de
              l'EG, et l'acte d'achat du notaire?
              <br />
              Notifiera tous les Pros par email.
            </span>
          )}
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
    reservationAgreement: { status: reservationAgreementStatus },
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
  const isAllowedToManageReservation = isAllowedToManageCustomerPromotionReservation({ promotion, currentUser, customerOwnerType });

  const isAdmin = Meteor.microservice === 'admin';

  const canReactivateReservation = [
    PROMOTION_OPTION_STATUS.RESERVATION_EXPIRED,
    PROMOTION_OPTION_STATUS.RESERVATION_CANCELLED,
    PROMOTION_OPTION_STATUS.RESERVATION_WAITLIST,
  ].includes(status) && isAllowedToManageReservation;
  const canCancelReservation = [
    PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
    PROMOTION_OPTION_STATUS.RESERVED,
    PROMOTION_OPTION_STATUS.SOLD,
  ].includes(status) && isAdmin;
  const canUploadReservationAgreement = status === PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE
    && reservationAgreementStatus === PROMOTION_OPTION_AGREEMENT_STATUS.WAITING
    && isAllowedToManageReservation;
  const canConfirmReservation = isAdmin && status === PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE;
  const canSellLot = isAdmin && status === PROMOTION_OPTION_STATUS.RESERVED;
  const confirmReservationIsDisabled = !Calculator.canConfirmPromotionLotReservation({ promotionOption });

  return {
    agreementDuration,
    canUploadReservationAgreement,
    canReactivateReservation,
    canCancelReservation,
    canConfirmReservation,
    canSellLot,
    confirmReservationIsDisabled,
  };
})(PromotionReservationDetailActions);
