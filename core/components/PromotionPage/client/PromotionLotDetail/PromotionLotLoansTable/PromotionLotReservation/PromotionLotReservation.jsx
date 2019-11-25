// @flow
import { Meteor } from 'meteor/meteor';

import React, { useContext } from 'react';

import { shouldAnonymize } from 'core/api/promotions/promotionClientHelpers';
import { PROMOTION_OPTION_STATUS } from 'core/api/constants';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import T from '../../../../../Translation';
import Button from '../../../../../Button';
import DialogSimple from '../../../../../DialogSimple';
import { getPromotionCustomerOwnerType } from '../../../../../../api/promotions/promotionClientHelpers';
import PromotionReservationDetail from '../../../PromotionReservations/PromotionReservationDetail/PromotionReservationDetail';
import PromotionReservationProgress from '../../../PromotionReservations/PromotionReservationProgress/PromotionReservationProgress';
import RequestReservation from '../../../UserPromotionOptionsTable/RequestReservation';

type PromotionLotReservationProps = {};

const isAdmin = Meteor.microservice === 'admin';

const PromotionLotReservation = ({
  loan,
  promotion,
  promotionOption,
}: PromotionLotReservationProps) => {
  const currentUser = useContext(CurrentUserContext);
  const { status, promotionLots } = promotionOption;
  const { users = [] } = promotion;
  const { $metadata: { permissions } = {} } =
    users.find(({ _id }) => _id === currentUser._id) || {};
  const [promotionLot] = promotionLots;
  const {
    $metadata: { invitedBy },
    agreementDuration,
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
            customerName: <b>{loan.user.name}</b>,
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
