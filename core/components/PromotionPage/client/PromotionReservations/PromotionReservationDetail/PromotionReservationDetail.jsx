// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import { cancelPromotionLotBooking, sellPromotionLot } from 'core/api/methods';
import { isUserAnonymized } from 'core/api/security/clientSecurityHelpers/index';
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
  anonymize,
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
  const isAnonymized = anonymize || isUserAnonymized(user);
  const isAdmin = Meteor.microservice === 'admin';
  const isDeadReservation = [
    PROMOTION_RESERVATION_STATUS.EXPIRED,
    PROMOTION_RESERVATION_STATUS.CANCELED,
  ].includes(status);
  const canCancelReservation = [
    PROMOTION_RESERVATION_STATUS.ACTIVE,
    PROMOTION_RESERVATION_STATUS.CONFIRMED,
    PROMOTION_RESERVATION_STATUS.COMPLETED,
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
      {!isAnonymized && (
        <UploaderArray
          doc={promotionReservation}
          collection={PROMOTION_RESERVATIONS_COLLECTION}
          documentArray={promotionReservationsArray}
          allowRequireByAdmin={false}
          disabled={!isAdmin}
          disableUpload={!isAdmin}
          autoRenameFiles
        />
      )}

      {isAdmin && (
        <div className="flex center mt-16">
          {canCancelReservation && (
            <ConfirmMethod
              buttonProps={{ className: 'mr-8', error: true, outlined: true }}
              label="Annuler réservation"
              method={() =>
                cancelPromotionLotBooking.run({ promotionOptionId })
              }
            />
          )}
          {isDeadReservation && (
            <ConfirmMethod
              buttonProps={{ primary: true, raised: true }}
              label="Réactiver réservation"
              method={() => bookPromotionLot.run({ promotionOptionId })}
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
