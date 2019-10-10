// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import { cancelPromotionLotBooking, sellPromotionLot } from 'core/api/methods';
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
    promotionLot,
    promotionOption: { _id: promotionOptionId },
    loan,
    expirationDate,
    status,
  } = promotionReservation;
  const isAdmin = Meteor.microservice === 'admin';

  return (
    <div>
      <div className="text-center" style={{ marginBottom: 40 }}>
        <PromotionReservationDeadline
          expirationDate={expirationDate}
          status={status}
        />
      </div>

      <PromotionReservationProgressEditor
        promotionReservation={promotionReservation}
      />
      <br />

      <UploaderArray
        doc={promotionReservation}
        collection={PROMOTION_RESERVATIONS_COLLECTION}
        documentArray={promotionReservationsArray}
        allowRequireByAdmin={false}
      />

      {isAdmin && (
        <div className="flex center mt-16">
          <ConfirmMethod
            buttonProps={{ className: 'mr-8', error: true, outlined: true }}
            label="Annuler réservation"
            method={() => cancelPromotionLotBooking.run({ promotionOptionId })}
          />
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
