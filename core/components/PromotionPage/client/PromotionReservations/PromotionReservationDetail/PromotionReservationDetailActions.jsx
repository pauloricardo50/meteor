import React from 'react';

import colors from '../../../../../config/colors';
import ConfirmMethod from '../../../../ConfirmMethod';
import PromotionLotReservationForm from '../../PromotionLotDetail/PromotionLotLoansTable/PromotionLotReservation/PromotionLotReservationForm';
import Button from '../../../../Button';
import T from '../../../../Translation';
import PromotionReservationDetailActionsContainer from './PromotionReservationDetailActionsContainer';

const PromotionReservationDetailActions = ({
  promotionOption,
  agreementDuration,
  canUploadReservationAgreement,
  canReactivateReservation,
  canCancelReservation,
  canConfirmReservation,
  canSellLot,
  confirmReservationIsDisabled,
  canAddToWaitList,
  cancelReservation,
  reactivateReservation,
  addToWaitList,
  confirmReservation,
  sellPromotionLot,
}) => (
  <div className="flex center mt-16">
    {canUploadReservationAgreement && (
      <PromotionLotReservationForm
        agreementDuration={agreementDuration}
        promotionOption={promotionOption}
        buttonProps={{
          className: 'mr-8 mb-8',
          primary: true,
          raised: true,
          label: <T id="PromotionReservationActions.uploadAgreement" />,
        }}
      />
    )}
    {canCancelReservation && (
      <ConfirmMethod
        buttonProps={{ className: 'mr-8 mb-8', error: true, outlined: true }}
        label={<T id="PromotionReservationActions.cancelReservation" />}
        method={cancelReservation}
        description={
          <T id="PromotionReservationActions.cancelReservation.description" />
        }
        keyword="ANNULER"
      />
    )}

    {canReactivateReservation && (
      <ConfirmMethod
        buttonProps={{
          className: 'mr-8 mb-8',
          raised: true,
          secondary: true,
        }}
        label={<T id="PromotionReservationActions.reactivateReservation" />}
        method={reactivateReservation}
        description={
          <T id="PromotionReservationActions.addToWaitList.description" />
        }
      />
    )}
    {canAddToWaitList && (
      <ConfirmMethod
        buttonProps={{
          className: 'mr-8 mb-8',
          outlined: true,
          style: { color: colors.warning, borderColor: colors.warning },
        }}
        label={<T id="PromotionReservationActions.addToWaitList" />}
        method={addToWaitList}
        description={
          <T id="PromotionReservationActions.addToWaitList.description" />
        }
      />
    )}
    {canConfirmReservation && (
      <ConfirmMethod
        buttonProps={{
          secondary: true,
          raised: true,
          disabled: confirmReservationIsDisabled,
          tooltip: confirmReservationIsDisabled ? (
            <T id="PromotionReservationActions.confirmReservation.tooltip" />
          ) : (
            undefined
          ),
          className: 'mr-8 mb-8',
        }}
        label={<T id="PromotionReservationActions.confirmReservation" />}
        method={confirmReservation}
        description={
          <T id="PromotionReservationActions.confirmReservation.description" />
        }
      />
    )}
    {canSellLot && (
      <ConfirmMethod
        buttonProps={{
          secondary: true,
          raised: true,
          className: 'mr-8 mb-8',
        }}
        label={<T id="PromotionReservationActions.sellLot" />}
        method={sellPromotionLot}
        description={<T id="PromotionReservationActions.sellLot.description" />}
        keyword="YES"
      />
    )}
  </div>
);

export default PromotionReservationDetailActionsContainer(
  PromotionReservationDetailActions,
);
