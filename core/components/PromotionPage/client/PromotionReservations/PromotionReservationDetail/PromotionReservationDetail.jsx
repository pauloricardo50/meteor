//
import { Meteor } from 'meteor/meteor';

import React from 'react';

import Calculator from 'core/utils/Calculator';
import {
  PROMOTION_OPTION_DOCUMENTS,
  PROMOTION_OPTIONS_COLLECTION,
  PROMOTION_OPTION_AGREEMENT_STATUS,
} from '../../../../../api/promotionOptions/promotionOptionConstants';
import UploaderArray from '../../../../UploaderArray';
import PromotionReservationProgressEditor from './PromotionReservationProgressEditor';
import PromotionReservationDeadline from '../PromotionReservationDeadline';
import PromotionReservationDetailActions from './PromotionReservationDetailActions';

const promotionReservationsArray = [
  {
    id: PROMOTION_OPTION_DOCUMENTS.RESERVATION_AGREEMENT,
    noTooltips: true,
  },
];

const PromotionReservationDetail = ({ promotionOption, loan }) => {
  const {
    _id: promotionOptionId,
    reservationAgreement: {
      expirationDate,
      startDate,
      status: reservationStatus,
    },
    status,
    isAnonymized,
  } = promotionOption;
  const isAdmin = Meteor.microservice === 'admin';
  const isActive = Calculator.isActivePromotionOption({ promotionOption });

  return (
    <div>
      <div className="text-center" style={{ marginBottom: 40 }}>
        <PromotionReservationDeadline
          promotionOption={promotionOption}
          startDate={startDate}
          expirationDate={expirationDate}
          status={status}
        />
      </div>
      <PromotionReservationProgressEditor
        promotionOption={promotionOption}
        loan={loan}
      />
      <br />
      {isActive &&
        reservationStatus === PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED &&
        !isAnonymized && (
          <UploaderArray
            doc={promotionOption}
            collection={PROMOTION_OPTIONS_COLLECTION}
            documentArray={promotionReservationsArray}
            allowRequireByAdmin={false}
            disabled={!isAdmin}
            disableUpload={!isAdmin}
            autoRenameFiles
            variant="simple"
          />
        )}

      <PromotionReservationDetailActions promotionOption={promotionOption} />
    </div>
  );
};

export default PromotionReservationDetail;
