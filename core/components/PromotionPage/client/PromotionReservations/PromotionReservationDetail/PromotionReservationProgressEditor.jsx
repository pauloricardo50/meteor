// @flow
import React, { useState } from 'react';

import T from '../../../../Translation';
import Button from '../../../../Button';
import PromotionReservationProgress from '../PromotionReservationProgress';

type PromotionReservationProgressEditorProps = {};

const PromotionReservationProgressEditor = ({
  promotionReservation,
}: PromotionReservationProgressEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="flex center-align">
        <h3 className="mr-16">
          <T id="PromotionReservationsTable.progress" />
        </h3>
        <Button primary size="small" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <T id="general.save" /> : <T id="general.modify" />}
        </Button>
      </div>
      <PromotionReservationProgress
        promotionReservation={promotionReservation}
        style={{ flexDirection: 'column', alignItems: 'stretch' }}
        variant="text"
      />
    </>
  );
};

export default PromotionReservationProgressEditor;
