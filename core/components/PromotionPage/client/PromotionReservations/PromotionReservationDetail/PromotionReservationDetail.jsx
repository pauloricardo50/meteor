// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import {
  PROMOTION_OPTION_DOCUMENTS,
  PROMOTION_OPTIONS_COLLECTION,
} from '../../../../../api/promotionOptions/promotionOptionConstants';
import UploaderArray from '../../../../UploaderArray';
import PromotionReservationProgressEditor from './PromotionReservationProgressEditor';
import PromotionReservationDeadline from '../PromotionReservationDeadline';
import PromotionReservationDetailActions from './PromotionReservationDetailActions';

type PromotionReservationDetailProps = {};

const promotionReservationsArray = [
  {
    id: PROMOTION_OPTION_DOCUMENTS.RESERVATION_AGREEMENT,
    noTooltips: true,
  },
];

const PromotionReservationDetail = ({
  promotionOption,
}: PromotionReservationDetailProps) => {
  const {
    _id: promotionOptionId,
    reservationAgreement: { expirationDate, startDate },
    loan,
    status,
    isAnonymized,
  } = promotionOption;
  const isAdmin = Meteor.microservice === 'admin';

  return (
    <div>
      <div className="text-center" style={{ marginBottom: 40 }}>
        <PromotionReservationDeadline
          promotionOptionId={promotionOptionId}
          startDate={startDate}
          expirationDate={expirationDate}
          status={status}
        />
      </div>
      <PromotionReservationProgressEditor promotionOption={promotionOption} />
      <br />
      {!isAnonymized && (
        <UploaderArray
          doc={promotionOption}
          collection={PROMOTION_OPTIONS_COLLECTION}
          documentArray={promotionReservationsArray}
          allowRequireByAdmin={false}
          disabled={!isAdmin}
          disableUpload={!isAdmin}
          autoRenameFiles
        />
      )}

      {isAdmin && (
        <PromotionReservationDetailActions promotionOption={promotionOption} />
      )}
    </div>
  );
};

export default PromotionReservationDetail;
