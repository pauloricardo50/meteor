import { Meteor } from 'meteor/meteor';

import React from 'react';

import {
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_DOCUMENTS,
} from '../../../../../api/promotionOptions/promotionOptionConstants';
import { proPromotionOptions } from '../../../../../api/promotionOptions/queries';
import { useStaticMeteorData } from '../../../../../hooks/useMeteorData';
import Calculator from '../../../../../utils/Calculator';
import Loading from '../../../../Loading';
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

const PromotionReservationDetail = ({
  promotionOption: { _id: promotionOptionId } = {},
  loan,
}) => {
  const { data: promotionOption } = useStaticMeteorData({
    query: proPromotionOptions,
    params: {
      promotionOptionId,
    },
    $body: {
      status: 1,
      createdAt: 1,
      promotionLots: { name: 1 },
      loan: {
        proNote: 1,
        loanProgress: 1,
        user: { name: 1, phoneNumbers: 1, email: 1 },
        promotions: { users: { name: 1, organisations: { name: 1 } } },
      },
      reservationDeposit: 1,
      simpleVerification: 1,
      fullVerification: 1,
      reservationAgreement: 1,
      bank: 1,
      isAnonymized: 1,
      documents: 1,
    },
    type: 'single',
  });

  if (!promotionOption) {
    return <Loading />;
  }

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
