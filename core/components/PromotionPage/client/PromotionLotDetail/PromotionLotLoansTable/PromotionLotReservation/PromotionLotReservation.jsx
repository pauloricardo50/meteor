import { Meteor } from 'meteor/meteor';

import React from 'react';

import { PROMOTION_OPTION_STATUS } from '../../../../../../api/promotionOptions/promotionOptionConstants';
import {
  getPromotionCustomerOwnerType,
  shouldAnonymize,
} from '../../../../../../api/promotions/promotionClientHelpers';
import useCurrentUser from '../../../../../../hooks/useCurrentUser';
import Button from '../../../../../Button';
import DialogSimple from '../../../../../DialogSimple';
import T from '../../../../../Translation';
import PromotionReservationProgress from '../../../../PromotionReservationProgress';
import PromotionReservationDetail from '../../../PromotionReservations/PromotionReservationDetail/PromotionReservationDetail';
import RequestReservation from '../../../UserPromotionOptionsTable/RequestReservation';
import { usePromotion } from '../../../PromotionPageContext';

const isAdmin = Meteor.microservice === 'admin';

const getAnonymize = (promotionLotStatus, invitedBy) => {
  if (isAdmin) {
    return false;
  }

  const { permissions } = usePromotion();
  const currentUser = useCurrentUser();
  const customerOwnerType = getPromotionCustomerOwnerType({
    invitedBy,
    currentUser,
  });

  return shouldAnonymize({
    customerOwnerType,
    permissions,
    promotionLotStatus,
  });
};

const PromotionLotReservation = ({
  promotionOption,
  loan = promotionOption.loan,
}) => {
  const { status, promotionLots, invitedBy } = promotionOption;
  const [{ status: promotionLotStatus, name }] = promotionLots;
  const anonymize = getAnonymize(promotionLotStatus, invitedBy);

  if (anonymize) {
    return null;
  }

  if (status === PROMOTION_OPTION_STATUS.INTERESTED) {
    return (
      <RequestReservation
        promotionOption={promotionOption}
        promotionLotName={name}
        status={status}
        buttonProps={{ size: 'small' }}
      />
    );
  }

  return (
    <DialogSimple
      title={
        <T
          id="PromotionReservationsTable.modalTitle"
          values={{
            lotName: <b>{name}</b>,
            customerName: (
              <b>
                {loan.user?.name ||
                  [loan.userCache?.firstName, loan.userCache?.lastName]
                    .filter(x => x)
                    .join(' ')}
              </b>
            ),
          }}
        />
      }
      closeOnly
      renderTrigger={({ handleOpen }) => (
        <div className="flex center-align">
          <PromotionReservationProgress
            promotionOption={promotionOption}
            className="mr-8 flex"
            StepperProps={{ style: { padding: 0 } }}
          />
          <Button
            raised
            primary
            onClick={event => {
              event.stopPropagation();
              handleOpen();
            }}
          >
            Détail
          </Button>
        </div>
      )}
      onClick={e => {
        e.stopPropagation();
      }}
    >
      <PromotionReservationDetail
        promotionOption={promotionOption}
        anonymize={anonymize}
        loan={loan}
      />
    </DialogSimple>
  );
};

export default PromotionLotReservation;
