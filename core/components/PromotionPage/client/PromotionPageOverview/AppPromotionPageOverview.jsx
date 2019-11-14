// @flow
import React from 'react';

import T from '../../../Translation';
import Calculator from '../../../../utils/Calculator';
import UserPromotionOptionsTable from '../UserPromotionOptionsTable';
import UserReservation from '../UserReservation';
import { AppPromotionLotsTable } from '../PromotionLotsTable';
import ResidenceTypeSetter from '../../../ResidenceTypeSetter';

type AppPromotionPageOverviewProps = {};

const AppPromotionPageOverview = ({
  loan,
  promotion,
}: AppPromotionPageOverviewProps) => {
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
            className="card1 card-top"
            progressVariant="text"
            loan={loan}
          />
        ))}
      {residenceType && promotionOptions && promotionOptions.length > 0 && (
        <div className="card1 card-top">
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
