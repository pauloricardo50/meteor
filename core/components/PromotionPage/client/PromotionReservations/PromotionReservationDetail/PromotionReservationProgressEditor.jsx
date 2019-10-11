// @flow
import { Meteor } from 'meteor/meteor';

import React, { useState } from 'react';

import T from '../../../../Translation';
import Button from '../../../../Button';
import PromotionReservationProgress from '../PromotionReservationProgress';

type PromotionReservationProgressEditorProps = {};

const PromotionReservationProgressEditor = ({
  promotionReservation,
}: PromotionReservationProgressEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const isAdmin = Meteor.microservice === 'admin';

  return (
    <>
      <div className="flex center-align">
        <h3 className="mr-16">
          <T id="PromotionReservationsTable.progress" />
        </h3>
        {isAdmin && (
          <Button primary size="small" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <T id="general.close" /> : <T id="general.modify" />}
          </Button>
        )}
      </div>
      <PromotionReservationProgress
        promotionReservation={promotionReservation}
        style={{ flexDirection: 'column', alignItems: 'stretch' }}
        variant="text"
        isEditing={isEditing}
      />
    </>
  );
};

export default PromotionReservationProgressEditor;
