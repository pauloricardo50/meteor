import { Meteor } from 'meteor/meteor';

import React, { useState } from 'react';

import T from '../../../../Translation';
import Button from '../../../../Button';
import PromotionReservationProgress from '../PromotionReservationProgress';

const PromotionReservationProgressEditor = ({ promotionOption, loan }) => {
  const isAdmin = Meteor.microservice === 'admin';

  return (
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
};

export default PromotionReservationProgressEditor;
