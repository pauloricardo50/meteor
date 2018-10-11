// @flow
import React from 'react';

import T from 'core/components/Translation';
import Button from 'core/components/Button';
import StatusLabel from 'core/components/StatusLabel';
import { createRoute } from 'core/utils/routerUtils';
import { PRO_PROMOTION_PAGE } from 'imports/startup/client/proRoutes';
import { PROMOTION_LOTS_COLLECTION } from 'imports/core/api/constants';
import ProPromotionLotPageContainer from './ProPromotionLotPageContainer';
import LotDocumentsManager from './LotDocumentsManager';
import PromotionLotsManager from './PromotionLotsManager';
import PromotionLotLoansTable from './PromotionLotLoansTable';

type ProPromotionLotPageProps = {};

const ProPromotionLotPage = ({
  promotionLot,
  currentUser,
  promotionId,
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
  const { lots: allLots } = promotion[0];

  return (
    <div>
      <Button
        raised
        primary
        link
        to={createRoute(PRO_PROMOTION_PAGE, { promotionId })}
      >
        <T id="general.back" />
      </Button>
      <div className="pro-promotion-lot-page card1">
        <h1>
          {name}
          &nbsp;
          <StatusLabel status={status} collection={PROMOTION_LOTS_COLLECTION} />
        </h1>
        <LotDocumentsManager
          property={properties[0]}
          currentUser={currentUser}
        />

        <h3>
          <T id="ProPromotionLotPage.manageLot" />
        </h3>
        <PromotionLotsManager
          promotionLotId={promotionLotId}
          lots={lots}
          allLots={allLots}
        />

        <PromotionLotLoansTable
          promotionOptions={promotionOptions}
          promotionLotStatus={status}
          promotionLotId={promotionLotId}
        />
      </div>
    </div>
  );
};
export default ProPromotionLotPageContainer(ProPromotionLotPage);
