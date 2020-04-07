import { Meteor } from 'meteor/meteor';

import React from 'react';

import {
  PROMOTION_OPTIONS_COLLECTION,
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_DOCUMENTS,
} from '../../../../../api/promotionOptions/promotionOptionConstants';
import Calculator from '../../../../../utils/Calculator';
import UploaderArray from '../../../../UploaderArray';
import PromotionReservationDeadline from '../PromotionReservationDeadline';
import PromotionReservationDetailActions from './PromotionReservationDetailActions';
import PromotionReservationProgressEditor from './PromotionReservationProgressEditor';

const promotionReservationsArray = [
  {
    id: PROMOTION_OPTION_DOCUMENTS.RESERVATION_AGREEMENT,
    noTooltips: true,
  },
];

const PromotionReservationDetail = ({ promotionOption, loan }) => {
  const {
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
