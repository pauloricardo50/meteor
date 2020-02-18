import React from 'react';

import T from '../../../../Translation';
import PromotionReservationProgress from '../PromotionReservationProgress';

const PromotionReservationProgressEditor = ({ promotionOption, loan }) => (
  <>
    <div className="flex center-align">
      <h3 className="mr-16">
        <T id="PromotionReservationsTable.progress" />
      </h3>
    </div>
    <PromotionReservationProgress
      promotionOption={promotionOption}
      style={{ flexDirection: 'column', alignItems: 'stretch' }}
      variant="text"
      className="full"
      loan={loan}
    />
  </>
);

export default PromotionReservationProgressEditor;
