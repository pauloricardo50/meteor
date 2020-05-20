import { Meteor } from 'meteor/meteor';

import { withProps } from 'recompose';

import {
  cancelPromotionLotReservation,
  reservePromotionLot,
  sellPromotionLot,
} from '../../../../../api/promotionLots/methodDefinitions';
import {
  promotionOptionActivateReservation,
  promotionOptionAddToWaitList,
} from '../../../../../api/promotionOptions/methodDefinitions';
import {
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_STATUS,
} from '../../../../../api/promotionOptions/promotionOptionConstants';
import { getPromotionCustomerOwnerType } from '../../../../../api/promotions/promotionClientHelpers';
import { isAllowedToManageCustomerPromotionReservation } from '../../../../../api/security/clientSecurityHelpers';
import useCurrentUser from '../../../../../hooks/useCurrentUser';
import Calculator from '../../../../../utils/Calculator';

export default withProps(({ promotionOption }) => {
  const {
    _id: promotionOptionId,
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

  const currentUser = useCurrentUser();
  const customerOwnerType = getPromotionCustomerOwnerType({
    invitedBy,
    currentUser,
  });

  const isAllowedToManageReservation = isAllowedToManageCustomerPromotionReservation(
    { promotion, currentUser, customerOwnerType },
  );
  const confirmReservationIsDisabled = !Calculator.canConfirmPromotionLotReservation(
    { promotionOption },
  );

  const isAdmin = Meteor.microservice === 'admin';

  const canUploadReservationAgreement =
    status === PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE &&
    reservationAgreementStatus === PROMOTION_OPTION_AGREEMENT_STATUS.WAITING &&
    isAllowedToManageReservation;
  const canConfirmReservation =
    isAdmin &&
    [
      PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
      PROMOTION_OPTION_STATUS.RESERVATION_WAITLIST,
    ].includes(status);
  const canCancelReservation =
    [
      PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
      PROMOTION_OPTION_STATUS.RESERVED,
      PROMOTION_OPTION_STATUS.SOLD,
      PROMOTION_OPTION_STATUS.RESERVATION_WAITLIST,
    ].includes(status) && isAdmin;
  const canAddToWaitList =
    isAdmin && status === PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE;
  const canReactivateReservation =
    [
      PROMOTION_OPTION_STATUS.RESERVATION_EXPIRED,
      PROMOTION_OPTION_STATUS.RESERVATION_CANCELLED,
    ].includes(status) && isAllowedToManageReservation;
  const canSellLot = isAdmin && status === PROMOTION_OPTION_STATUS.RESERVED;

  return {
    agreementDuration,
    canUploadReservationAgreement,
    canReactivateReservation,
    canCancelReservation,
    canConfirmReservation,
    canSellLot,
    confirmReservationIsDisabled,
    canAddToWaitList,
    cancelReservation: () =>
      cancelPromotionLotReservation.run({ promotionOptionId }),
    reactivateReservation: () =>
      promotionOptionActivateReservation.run({ promotionOptionId }),
    addToWaitList: () =>
      promotionOptionAddToWaitList.run({ promotionOptionId }),
    confirmReservation: () => reservePromotionLot.run({ promotionOptionId }),
    sellPromotionLot: () => sellPromotionLot.run({ promotionOptionId }),
  };
});
