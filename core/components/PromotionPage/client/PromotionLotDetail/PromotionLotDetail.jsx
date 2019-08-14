// @flow
import React, { useContext } from 'react';

import T from '../../../Translation';
import DocumentDownloadList from '../../../DocumentDownloadList';
import PromotionPermissionsContext from '../PromotionPermissions';
import PromotionLotDetailRecaps from './PromotionLotDetailRecaps';
import PromotionLotsManager from './PromotionLotsManager';

type PromotionLotDetailProps = {};

const PromotionLotDetail = ({
  promotionLot,
  promotion,
}: PromotionLotDetailProps) => {
  const { lots, _id: promotionLotId, status, documents } = promotionLot;
  const { lots: allLots } = promotion;
  const { canModifyLots } = useContext(PromotionPermissionsContext);

  return (
    <div className="promotion-lot-detail">
      <div className="top">
        <PromotionLotDetailRecaps promotionLot={promotionLot} />
      </div>
      <h4>
        <T id="PromotionLotPage.manageLot" />
      </h4>
      <PromotionLotsManager
        promotionLotId={promotionLotId}
        lots={lots}
        allLots={allLots}
        status={status}
        canModifyLots={canModifyLots}
      />
      <h4>
        <T id="PromotionLotPage.downloads" />
      </h4>
      <DocumentDownloadList
        files={documents && documents.promotionPropertyDocuments}
      />
    </div>
  );
};

export default PromotionLotDetail;
