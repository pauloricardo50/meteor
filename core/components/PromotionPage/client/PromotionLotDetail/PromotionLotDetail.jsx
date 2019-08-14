// @flow
import React, { useContext } from 'react';

import T from '../../../Translation';
import DocumentDownloadList from '../../../DocumentDownloadList';
import PromotionPermissionsContext from '../PromotionPermissions';
import PromotionLotDetailRecaps from './PromotionLotDetailRecaps';
import PromotionLotsManager from './PromotionLotsManager';
import PromotionLotTimeline from './PromotionLotTimeline';

type PromotionLotDetailProps = {};

const PromotionLotDetail = ({
  promotionLot,
  promotion,
}: PromotionLotDetailProps) => {
  const { lots, _id: promotionLotId, status, documents } = promotionLot;
  const { lots: allLots, constructionTimeline, signingDate } = promotion;
  const { canModifyLots } = useContext(PromotionPermissionsContext);

  return (
    <div className="promotion-lot-detail">
      <section className="top">
        <PromotionLotDetailRecaps promotionLot={promotionLot} />
      </section>

      <section>
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
      </section>

      <section>
        <h4>
          <T id="PromotionLotPage.downloads" />
        </h4>
        <DocumentDownloadList
          files={documents && documents.promotionPropertyDocuments}
        />
      </section>

      {constructionTimeline && constructionTimeline.length > 0 && (
        <section>
          <h4>
            <T id="PromotionLotPage.manageLot" />
          </h4>
          <PromotionLotTimeline
            constructionTimeline={constructionTimeline}
            signingDate={signingDate}
            promotionLot={promotionLot}
          />
        </section>
      )}
    </div>
  );
};

export default PromotionLotDetail;
