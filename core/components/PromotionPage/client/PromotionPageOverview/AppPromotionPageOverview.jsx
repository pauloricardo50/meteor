import React from 'react';

import Calculator from '../../../../utils/Calculator';
import ResidenceTypeSetter from '../../../ResidenceTypeSetter';
import T from '../../../Translation';
import { AppPromotionLotsTable } from '../PromotionLotsTable';
import UserPromotionOptionsTable from '../UserPromotionOptionsTable';
import UserReservation from '../UserReservation';

const AppPromotionPageOverview = ({ loan, promotion }) => {
  const { residenceType, promotionOptions } = loan;
  const activePromotionOptions = Calculator.getActivePromotionOptions({ loan });

  return (
    <>
      <ResidenceTypeSetter
        loan={loan}
        text={<T id="PromotionPage.residenceTypeSetter.text" />}
      />
      {!!activePromotionOptions.length &&
        activePromotionOptions.map(promotionOption => (
          <UserReservation
            promotionOption={promotionOption}
            key={promotionOption._id}
            className="card1 card-top user-reservation"
            progressVariant="text"
            loan={loan}
          />
        ))}
      {residenceType && promotionOptions && promotionOptions.length > 0 && (
        <div className="card1 card-top promotion-options-table">
          <UserPromotionOptionsTable promotion={promotion} loan={loan} />
        </div>
      )}
      {residenceType && (
        <AppPromotionLotsTable
          promotion={promotion}
          loan={loan}
          className="card1 card-top"
        />
      )}
    </>
  );
};

export default AppPromotionPageOverview;
