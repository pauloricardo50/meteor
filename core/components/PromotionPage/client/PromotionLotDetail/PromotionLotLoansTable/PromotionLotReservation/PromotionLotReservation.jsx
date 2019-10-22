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
import PromotionLotReservationForm from './PromotionLotReservationForm';

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
  const { $metadata: { permissions } = {} } = users.find(({ _id }) => _id === currentUser._id) || {};
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
      <PromotionLotReservationForm
        agreementDuration={agreementDuration}
        promotionOption={promotionOption}
      />
    );
  }

  return (
    <DialogSimple
      title={(
        <T
          id="PromotionReservationsTable.modalTitle"
          values={{
            lotName: <b>{promotionLot.name}</b>,
            customerName: <b>{loan.user.name}</b>,
          }}
        />
      )}
      closeOnly
      renderTrigger={({ handleOpen }) => (
        <div className="flex center-align">
          <PromotionReservationProgress
            promotionOption={promotionOption}
            className="mr-8"
          />
          <Button raised primary onClick={handleOpen}>
            Détail
          </Button>
        </div>
      )}
    >
      <PromotionReservationDetail
        promotionOption={promotionOption}
        anonymize={anonymize}
      />
    </DialogSimple>
  );
};

export default PromotionLotReservation;
