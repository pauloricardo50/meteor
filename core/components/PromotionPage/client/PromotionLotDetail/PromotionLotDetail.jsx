// @flow
import { Meteor } from 'meteor/meteor';

import React, { useContext } from 'react';

import { CurrentUserContext } from '../../../../containers/CurrentUserContext';
import T from '../../../Translation';
import DocumentDownloadList from '../../../DocumentDownloadList';
import PromotionMetadataContext from '../PromotionMetadata';
import PromotionLotDetailRecaps from './PromotionLotDetailRecaps';
import PromotionLotsManager from './PromotionLotsManager';
import PromotionLotTimeline from './PromotionLotTimeline';
import PromotionLotLoansTable from './PromotionLotLoansTable';

type PromotionLotDetailProps = {};

const displayPromotionLotLoansTable = ({ canSeeCustomers }) => {
  if (Meteor.microservice === 'pro') {
    return canSeeCustomers;
  }

  return Meteor.microservice === 'admin';
};

const PromotionLotDetail = ({
  promotionLot,
  promotion,
}: PromotionLotDetailProps) => {
  const {
    lots,
    _id: promotionLotId,
    status,
    documents,
    promotionOptions,
  } = promotionLot;
  const { lots: allLots, constructionTimeline, signingDate } = promotion;
  const {
    permissions: { canModifyLots, canSeeCustomers },
  } = useContext(PromotionMetadataContext);
  const currentUser = useContext(CurrentUserContext);

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
            <T id="PromotionPage.timeline" />
          </h4>
          <PromotionLotTimeline
            constructionTimeline={constructionTimeline}
            signingDate={signingDate}
            promotionLot={promotionLot}
          />
        </section>
      )}
      {displayPromotionLotLoansTable({ canSeeCustomers }) && (
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
