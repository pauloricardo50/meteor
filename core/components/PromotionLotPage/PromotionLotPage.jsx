// @flow
import React from 'react';
import { Meteor } from 'meteor/meteor';

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
import DocumentDownloadList from '../DocumentDownloadList';
import PromotionLotRecapTable from './PromotionLotRecapTable';

type PromotionLotPageProps = {};

const displayPromotionLotLoansTable = ({ canSeeCustomers }) => {
  if (Meteor.microservice === 'pro') {
    return canSeeCustomers;
  }

  return true;
};

const PromotionLotPage = ({
  promotionLot,
  currentUser,
  promotionId,
  canManageDocuments,
  canModifyLots,
  canRemoveLots,
  canSeeCustomers,
}: PromotionLotPageProps) => {
  const {
    name,
    properties,
    _id: promotionLotId,
    lots,
    promotion,
    promotionOptions,
    status,
    documents,
  } = promotionLot;
  const { lots: allLots } = promotion;
  const property = properties.length > 0 && properties[0];
  const { description } = property;

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
        <h1 style={{ marginBottom: '4px' }}>
          {name} - CHF {toMoney(promotionLot.value)}
          &nbsp;
          <StatusLabel status={status} collection={PROMOTION_LOTS_COLLECTION} />
        </h1>
        {description && <h3 className="secondary">{description}</h3>}
        {Meteor.microservice !== 'app' && (
          <div className="promotion-buttons">
            {canManageDocuments && (
              <LotDocumentsManager
                documents={documents}
                property={properties[0]}
                currentUser={currentUser}
              />
            )}
            {canModifyLots && (
              <PromotionLotModifier promotionLot={promotionLot} />
            )}
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
          canModifyLots={canModifyLots}
        />
        <PromotionLotRecapTable promotionLot={promotionLot} />

        <DocumentDownloadList
          files={documents && documents.promotionPropertyDocuments}
        />

        {displayPromotionLotLoansTable({ canSeeCustomers }) && (
          <PromotionLotLoansTable
            promotionOptions={promotionOptions}
            promotionLot={promotionLot}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

export default PromotionLotPage;
