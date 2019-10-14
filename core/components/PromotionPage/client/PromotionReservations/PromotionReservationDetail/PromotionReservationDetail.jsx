// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import { cancelPromotionLotBooking, sellPromotionLot } from 'core/api/methods';
import { isUserAnonymized } from 'core/api/security/clientSecurityHelpers';
import {
  PROMOTION_RESERVATION_DOCUMENTS,
  PROMOTION_RESERVATIONS_COLLECTION,
  PROMOTION_RESERVATION_STATUS,
} from '../../../../../api/promotionReservations/promotionReservationConstants';
import UploaderArray from '../../../../UploaderArray';
import ConfirmMethod from '../../../../ConfirmMethod';
import PromotionReservationProgressEditor from './PromotionReservationProgressEditor';
import PromotionReservationDeadline from '../PromotionReservationDeadline';

type PromotionReservationDetailProps = {};

const promotionReservationsArray = [
  {
    id: PROMOTION_RESERVATION_DOCUMENTS.RESERVATION_AGREEMENT,
    noTooltips: true,
  },
];

const PromotionReservationDetail = ({
  promotionReservation,
}: PromotionReservationDetailProps) => {
  const {
    _id,
    expirationDate,
    loan,
    promotionLot,
    promotionOption: { _id: promotionOptionId },
    startDate,
    status,
  } = promotionReservation;
  const { user } = loan;
  const userIsAnonymized = isUserAnonymized(user);
  const isAdmin = Meteor.microservice === 'admin';
  const isDeadReservation = [
    PROMOTION_RESERVATION_STATUS.EXPIRED,
    PROMOTION_RESERVATION_STATUS.CANCELED,
  ].includes(status);

  return (
    <div>
      <div className="text-center" style={{ marginBottom: 40 }}>
        <PromotionReservationDeadline
          promotionReservationId={_id}
          startDate={startDate}
          expirationDate={expirationDate}
          status={status}
        />
      </div>
      <PromotionReservationProgressEditor
        promotionReservation={promotionReservation}
      />
      <br />
      {!userIsAnonymized && (
        <UploaderArray
          doc={promotionReservation}
          collection={PROMOTION_RESERVATIONS_COLLECTION}
          documentArray={promotionReservationsArray}
          allowRequireByAdmin={false}
          disabled={!isAdmin}
          disableUpload={!isAdmin}
        />
      )}

      {isAdmin && (
        <div className="flex center mt-16">
          {isDeadReservation && (
            <ConfirmMethod
              buttonProps={{ className: 'mr-8', error: true, outlined: true }}
              label="Annuler réservation"
              method={() =>
                cancelPromotionLotBooking.run({ promotionOptionId })
              }
            />
          )}
          {status === PROMOTION_RESERVATION_STATUS.ACTIVE && (
            <ConfirmMethod
              buttonProps={{ secondary: true, raised: true }}
              label="Confirmer vente"
              method={() => sellPromotionLot.run({ promotionOptionId })}
            />
          )}
        </div>
      )}
    </div>
  );
};
export default PromotionReservationDetail;
