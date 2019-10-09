// @flow
import React from 'react';
import moment from 'moment';

import {
  PROMOTION_RESERVATION_DOCUMENTS,
  PROMOTION_RESERVATIONS_COLLECTION,
} from '../../../../../api/promotionReservations/promotionReservationConstants';
import T from '../../../../Translation';
import UploaderArray from '../../../../UploaderArray';
import PromotionReservationProgressEditor from './PromotionReservationProgressEditor';

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
  const { _id, promotionLot, loan, expirationDate } = promotionReservation;
  return (
    <div>
      <div className="text-center" style={{ marginBottom: 40 }}>
        <label htmlFor="">
          <T id="Forms.expirationDate" />
          <h1>{moment(expirationDate).fromNow()}</h1>
        </label>
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
