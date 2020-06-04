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
import PromotionReservationProgress from '../../../../PromotionReservationProgress/PromotionReservationProgress';
import PromotionReservationDetail from '../../../PromotionReservations/PromotionReservationDetail/PromotionReservationDetail';
import RequestReservation from '../../../UserPromotionOptionsTable/RequestReservation';

const isAdmin = Meteor.microservice === 'admin';

const PromotionLotReservation = ({ loan, promotion, promotionOption }) => {
  const currentUser = useCurrentUser();
  const { status, promotionLots } = promotionOption;
  const { users = [] } = promotion;
  const { $metadata: { permissions } = {} } =
    users.find(({ _id }) => _id === currentUser._id) || {};
  const [promotionLot] = promotionLots;
  const {
    $metadata: { invitedBy },
  } = promotion;

  const customerOwnerType = getPromotionCustomerOwnerType({
    invitedBy,
    currentUser,
  });
  const { status: promotionLotStatus } = promotionLot;
  const anonymize = isAdmin
    ? false
    : shouldAnonymize({
        customerOwnerType,
        permissions,
        promotionLotStatus,
      });

  if (anonymize) {
    return null;
  }

  if (status === PROMOTION_OPTION_STATUS.INTERESTED) {
    return (
      <RequestReservation
        promotionOption={promotionOption}
        promotionLotName={promotionLot.name}
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
            lotName: <b>{promotionLot.name}</b>,
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
            loan={loan}
            promotionOption={promotionOption}
            className="mr-8"
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
