import { Meteor } from 'meteor/meteor';

import React, { useState } from 'react';

import T from '../../Translation';
import PromotionReservationProgress from './PromotionReservationProgress';
import StatusDateDialogForm from './StatusDateDialogForm';

const isAdmin = Meteor.microservice === 'admin';

const PromotionReservationProgressEditor = ({ promotionOption, loan }) => {
  const [dialogId, setDialogId] = useState();
  const status = promotionOption[dialogId]?.status;
  const conditions = promotionOption[dialogId]?.conditions;

  return (
    <>
      <div className="flex center-align">
        <h3 className="mr-16">
          <T id="PromotionReservationsTable.progress" />
        </h3>
      </div>

      {isAdmin && (
        <StatusDateDialogForm
          promotionOptionId={promotionOption._id}
          loanId={loan._id}
          id={dialogId}
          status={status}
          openDialog={!!dialogId}
          setOpenDialog={() => setDialogId()}
          conditions={conditions}
        />
      )}

      <PromotionReservationProgress
        promotionOption={promotionOption}
        showLabels
        showLoanProgress
        vertical
        onClick={isAdmin && (id => setDialogId(id))}
      />
    </>
  );
};

export default PromotionReservationProgressEditor;
