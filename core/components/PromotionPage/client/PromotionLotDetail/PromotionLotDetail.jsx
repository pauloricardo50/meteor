import { Meteor } from 'meteor/meteor';

import React from 'react';
import { compose, mapProps } from 'recompose';

import withSmartQuery from '../../../../api/containerToolkit/withSmartQuery';
import { formProperty } from '../../../../api/fragments';
import {
  appPromotionLots,
  proPromotionLots,
} from '../../../../api/promotionLots/queries';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import Box from '../../../Box';
import DocumentDownloadList from '../../../DocumentDownloadList';
import T from '../../../Translation';
import LotDocumentsManager from '../PromotionLotsTable/LotDocumentsManager';
import PromotionLotModifier from '../PromotionLotsTable/PromotionLotModifier';
import { usePromotion } from '../PromotionPageContext';
import PromotionLotDetailRecaps from './PromotionLotDetailRecaps';
import PromotionLotLoansTable from './PromotionLotLoansTable';
import PromotionLotsManager from './PromotionLotsManager';
import PromotionLotTimeline from './PromotionLotTimeline';

const PromotionLotDetail = ({ promotionLot, children }) => {
  const { lots = [], _id: promotionLotId, status, documents } = promotionLot;
  const {
    permissions: { canModifyLots, canSeeCustomers, canManageDocuments },
    promotion: { _id: promotionId, constructionTimeline = [], signingDate },
  } = usePromotion();
  const currentUser = useCurrentUser();
  const files = (documents && documents.promotionPropertyDocuments) || [];

  return (
    <div className="promotion-lot-detail">
      <div className="flex mb-8">
        {canModifyLots && (
          <PromotionLotModifier className="mr-8" promotionLot={promotionLot} />
        )}
        {canManageDocuments && (
          <LotDocumentsManager
            documents={promotionLot?.documents}
            property={promotionLot?.properties[0]}
            currentUser={currentUser}
          />
        )}
      </div>
      {children}
      <section className="top">
        <PromotionLotDetailRecaps promotionLot={promotionLot} />
        <PromotionLotsManager
          promotionId={promotionId}
          promotionLotId={promotionLotId}
          lots={lots}
          status={status}
        />
        {files.length > 0 && (
          <Box>
            <h4 className="mt-0">
              <T id="PromotionLotPage.downloads" />
            </h4>
            <DocumentDownloadList files={files} />
          </Box>
        )}
      </section>

      {constructionTimeline?.steps?.length > 0 && (
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
          <PromotionLotLoansTable promotionLotId={promotionLot._id} />
        </section>
      )}
    </div>
  );
};

const isApp = Meteor.microservice === 'app';

export default compose(
  mapProps(({ promotionLot: { _id: promotionLotId } }) => ({
    promotionLotId,
  })),
  withSmartQuery({
    query: isApp ? appPromotionLots : proPromotionLots,
    params: ({ promotionLotId }) => ({
      _id: promotionLotId,
      $body: {
        documents: 1,
        lots: { type: 1, name: 1, value: 1 },
        properties: { ...formProperty(), name: 1 },
        status: 1,
        promotionLotGroupIds: 1,
        promotion: { promotionLotGroups: 1 },
      },
    }),
    dataName: 'promotionLot',
    queryOptions: { single: true },
  }),
)(PromotionLotDetail);
