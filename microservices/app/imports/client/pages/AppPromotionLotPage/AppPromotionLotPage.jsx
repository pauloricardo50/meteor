// @flow
import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import DocumentDownloadList from 'core/components/DocumentDownloadList';
import ClickToEditField from 'core/components/ClickToEditField';
import PromotionLotRecapTable from 'core/components/PromotionLotPage/PromotionLotRecapTable';
import {
  PROMOTION_LOTS_COLLECTION,
  PROMOTION_STATUS,
} from 'core/api/constants';
import { createRoute } from 'core/utils/routerUtils';
import { toMoney } from 'core/utils/conversionFunctions';
import LotChip from 'core/components/PromotionPage/client/ProPromotionLotsTable/LotChip';
import ROUTES from '../../../startup/client/appRoutes';
import AppPromotionLotPageContainer from './AppPromotionLotPageContainer';

type AppPromotionLotPageProps = {
  promotionOption: Object,
  promotionLot: Object,
  loan: Object,
  promotionId: String,
  setCustom: Function,
};

export const AppPromotionLotPage = ({
  promotionOption,
  promotionLot,
  loan: { _id: loanId },
  promotionId,
  setCustom,
}: AppPromotionLotPageProps) => {
  const {
    name,
    reducedStatus,
    promotion,
    lots,
    documents,
    properties,
  } = promotionLot;
  const { custom, attributedToMe } = promotionOption || {};
  const property = properties.length > 0 && properties[0];
  const { description } = property;

  return (
    <div>
      <Button
        raised
        primary
        link
        to={createRoute(ROUTES.APP_PROMOTION_PAGE.path, {
          loanId,
          promotionId,
        })}
      >
        <T id="general.back" />
      </Button>

      <div className="card1 app-promotion-option-page">
        <h1 style={{ marginBottom: '4px' }}>
          {name}
          {' '}
- CHF
          {toMoney(promotionLot.value)}
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

        {setCustom && (
          <>
            <h4>
              <T id="Forms.promotionOptions.custom" />
            </h4>
            <ClickToEditField
              placeholder={<T id="Forms.promotionOptions.custom.placeholder" />}
              value={custom}
              onSubmit={setCustom}
              className="custom-edit"
              allowEditing={
                !attributedToMe && promotion.status === PROMOTION_STATUS.OPEN
              }
            />
          </>
        )}

        <DocumentDownloadList
          files={documents && documents.promotionPropertyDocuments}
        />
      </div>
    </div>
  );
};

export default AppPromotionLotPageContainer(AppPromotionLotPage);
