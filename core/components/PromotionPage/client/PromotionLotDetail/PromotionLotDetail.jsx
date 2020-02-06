//
import React, { useContext } from 'react';

import { CurrentUserContext } from '../../../../containers/CurrentUserContext';
import T from '../../../Translation';
import Box from '../../../Box';
import DocumentDownloadList from '../../../DocumentDownloadList';
import PromotionMetadataContext from '../PromotionMetadata';
import PromotionLotDetailRecaps from './PromotionLotDetailRecaps';
import PromotionLotsManager from './PromotionLotsManager';
import PromotionLotTimeline from './PromotionLotTimeline';
import PromotionLotLoansTable from './PromotionLotLoansTable';

const PromotionLotDetail = ({ promotionLot, promotion, children }) => {
  const {
    lots = [],
    _id: promotionLotId,
    status,
    documents,
    promotionOptions,
  } = promotionLot;
  const { lots: allLots, constructionTimeline = [], signingDate } = promotion;
  const {
    permissions: { canModifyLots, canSeeCustomers },
  } = useContext(PromotionMetadataContext);
  const currentUser = useContext(CurrentUserContext);
  const files = (documents && documents.promotionPropertyDocuments) || [];

  return (
    <div className="promotion-lot-detail">
      {children}
      <section className="top">
        <PromotionLotDetailRecaps promotionLot={promotionLot} />
        {lots.length > 0 && (
          <Box>
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
          </Box>
        )}
        {files.length > 0 && (
          <Box>
            <h4>
              <T id="PromotionLotPage.downloads" />
            </h4>
            <DocumentDownloadList files={files} />
          </Box>
        )}
      </section>

      {constructionTimeline.length > 0 && (
        <section>
          <h4>
            <T id="PromotionPage.timeline" />
          </h4>
          <PromotionLotTimeline
            constructionTimeline={constructionTimeline}
            signingDate={signingDate}
            promotionLot={promotionLot}
          />
        </section>
      )}
      {canSeeCustomers && (
        <section>
          <h4>
            <T id="PromotionLotPage.loans" />
          </h4>
          <PromotionLotLoansTable
            promotionOptions={promotionOptions}
            promotionLot={promotionLot}
            currentUser={currentUser}
          />
        </section>
      )}
    </div>
  );
};

export default PromotionLotDetail;
