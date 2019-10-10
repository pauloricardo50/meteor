// @flow
import React from 'react';

import {
  PROMOTION_RESERVATION_DOCUMENTS,
  PROMOTION_RESERVATIONS_COLLECTION,
} from '../../../../../api/promotionReservations/promotionReservationConstants';
import UploaderArray from '../../../../UploaderArray';
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
    loan,
    expirationDate,
    status,
  } = promotionReservation;
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
    </div>
  );
};
export default PromotionReservationDetail;
