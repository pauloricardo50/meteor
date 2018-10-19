// @flow
import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import DocumentDownloadList from 'core/components/DocumentDownloadList';
import ClickToEditField from 'core/components/ClickToEditField';
import { PROMOTION_LOTS_COLLECTION } from 'core/api/constants';
import { createRoute } from 'core/utils/routerUtils';
import { toMoney } from 'core/utils/conversionFunctions';
import LotChip from 'core/components/PromotionPage/client/ProPromotionLotsTable/LotChip';
import { APP_PROMOTION_PAGE } from '../../../startup/client/appRoutes';
import AppPromotionLotPageContainer from './AppPromotionLotPageContainer';

type AppPromotionLotPageProps = {};

export const AppPromotionLotPage = ({
  promotionOption,
  promotionLot,
  loan: { _id: loanId, promotions: loanPromotions },
  promotionId,
  setCustom,
}: AppPromotionLotPageProps) => {
  const { name, status, promotion, value, lots, documents } = promotionLot;
  const { name: promotionName } = promotion[0];
  const { custom, attributedToMe } = promotionOption || {};
  console.log('promotionLot', promotionLot);
  console.log('loanPromotions', loanPromotions); // Should have $metadata

  return (
    <div>
      <Button
        raised
        primary
        link
        to={createRoute(APP_PROMOTION_PAGE, {
          loanId,
          promotionId,
        })}
      >
        <T id="general.back" />
      </Button>

      <div className="card1 app-promotion-option-page">
        <h1>
          {name}
          &nbsp;
          <StatusLabel status={status} collection={PROMOTION_LOTS_COLLECTION} />
        </h1>
        <h3 className="secondary">
          <T
            id="AppPromotionLotPage.subtitle"
            values={{ promotionName, value: `CHF ${toMoney(value)}` }}
          />
        </h3>

        <h4>
          <T id="collections.lots" />
        </h4>
        <div className="lots">
          {lots.map(lot => (
            <LotChip lot={lot} key={lot._id} />
          ))}
        </div>

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
              allowEditing={!attributedToMe}
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
