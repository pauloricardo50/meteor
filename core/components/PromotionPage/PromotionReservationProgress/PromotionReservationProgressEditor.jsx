import React, { useState } from 'react';

import T from '../../Translation';
import PromotionReservationProgress from './PromotionReservationProgress';
import StatusDateDialogForm from './StatusDateDialogForm';

const PromotionReservationProgressEditor = ({ promotionOption, loan }) => {
  const [dialogId, setDialogId] = useState();
  const status = promotionOption[dialogId]?.status;

  return (
    <>
      <div className="flex center-align">
        <h3 className="mr-16">
          <T id="PromotionReservationsTable.progress" />
        </h3>
      </div>

      <StatusDateDialogForm
        promotionOptionId={promotionOption._id}
        loanId={loan._id}
        id={dialogId}
        status={status}
        openDialog={!!dialogId}
        setOpenDialog={() => setDialogId()}
      />

      <PromotionReservationProgress
        promotionOption={promotionOption}
        showLabel
        showLoanProgress
        vertical
        onClick={id => setDialogId(id)}
      />
    </>
  );
};

export default PromotionReservationProgressEditor;
