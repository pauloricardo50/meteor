// @flow
import React from 'react';

import T from 'core/components/Translation';
import Button from 'core/components/Button';
import StatusLabel from 'core/components/StatusLabel';
import { createRoute } from 'core/utils/routerUtils';
import { PROMOTION_LOTS_COLLECTION } from 'imports/core/api/constants';
import { toMoney } from 'imports/core/utils/conversionFunctions';
import PromotionLotModifier from './PromotionLotModifier';
import LotDocumentsManager from './LotDocumentsManager';
import PromotionLotsManager from './PromotionLotsManager';
import PromotionLotLoansTable from './PromotionLotLoansTable';

type ProPromotionLotPageProps = {};

const ProPromotionLotPage = ({
  promotionLot,
  currentUser,
  promotionId,
  canModify,
}: ProPromotionLotPageProps) => {
  const {
    name,
    properties,
    _id: promotionLotId,
    lots,
    promotion,
    promotionOptions,
    status,
  } = promotionLot;
  console.log('promotionLot', promotionLot);
  const { lots: allLots } = promotion;

  return (
    <div>
      <Button
        raised
        primary
        link
        to={createRoute('/promotions/:promotionId', { promotionId })}
      >
        <T id="general.back" />
      </Button>
      <div className="promotion-lot-page card1">
        <h1>
          {name} - CHF {toMoney(promotionLot.value)}
          &nbsp;
          <StatusLabel status={status} collection={PROMOTION_LOTS_COLLECTION} />
        </h1>
        {canModify && (
          <div className="promotion-buttons">
            <LotDocumentsManager
              property={properties[0]}
              currentUser={currentUser}
            />
            <PromotionLotModifier promotionLot={promotionLot} />
          </div>
        )}

        <h3>
          <T id="PromotionLotPage.manageLot" />
        </h3>
        <PromotionLotsManager
          promotionLotId={promotionLotId}
          lots={lots}
          allLots={allLots}
          status={promotionLot.status}
          canModify={canModify}
        />

        <PromotionLotLoansTable
          promotionOptions={promotionOptions}
          promotionLot={promotionLot}
          canModify={canModify}
        />
      </div>
    </div>
  );
};
export default ProPromotionLotPage;
