//
import React from 'react';

import Button from 'core/components/Button';
import T, { Money } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import DocumentDownloadList from 'core/components/DocumentDownloadList';
import ClickToEditField from 'core/components/ClickToEditField';
import PromotionLotRecapTable from 'core/components/PromotionLotPage/PromotionLotRecapTable';
import {
  PROMOTION_LOTS_COLLECTION,
  PROMOTION_STATUS,
} from 'core/api/constants';
import { createRoute } from 'core/utils/routerUtils';
import LotChip from 'core/components/PromotionPage/client/ProPromotionLotsTable/LotChip';
import APP_ROUTES from '../../../startup/client/appRoutes';
import AppPromotionLotPageContainer from './AppPromotionLotPageContainer';

export const AppPromotionLotPage = ({
  promotionOption,
  promotionLot,
  loan: { _id: loanId },
  promotionId,
}) => {
  const {
    name,
    reducedStatus,
    promotion,
    lots,
    documents,
    properties,
  } = promotionLot;
  const { attributedToMe } = promotionOption || {};
  const property = properties.length > 0 && properties[0];
  const { description } = property;

  return (
    <div>
      <Button
        raised
        primary
        link
        to={createRoute(APP_ROUTES.APP_PROMOTION_PAGE.path, {
          loanId,
          promotionId,
        })}
      >
        <T id="general.back" />
      </Button>

      <div className="card1 app-promotion-lot-page">
        <h1 style={{ marginBottom: '4px' }}>
          {name}
          {' -'}
          &nbsp;
          <Money value={promotionLot.value} />
          &nbsp;
          <StatusLabel
            status={reducedStatus}
            collection={PROMOTION_LOTS_COLLECTION}
          />
        </h1>
        {description && <h3 className="secondary">{description}</h3>}
        {lots.length > 0 && (
          <h4>
            <T id="PromotionLotPage.manageLot" />
          </h4>
        )}
        <div className="lots">
          {lots.map(lot => (
            <LotChip lot={lot} key={lot._id} />
          ))}
        </div>
        <PromotionLotRecapTable promotionLot={promotionLot} />

        <DocumentDownloadList
          files={documents && documents.promotionPropertyDocuments}
        />
      </div>
    </div>
  );
};

export default AppPromotionLotPageContainer(AppPromotionLotPage);
