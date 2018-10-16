// @flow
import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';

import AppPromotionLotPageContainer from './AppPromotionLotPageContainer';

type AppPromotionLotPageProps = {};

export const AppPromotionLotPage = ({
  fromPromotionPage,
  promotionLot: { name },
}: AppPromotionLotPageProps) => (
  <div>
    {fromPromotionPage && (
      <Button>
        <T id="general.back" />
      </Button>
    )}
    <div className="app-promotion-option-page">
      <h1>{name}</h1>
    </div>
  </div>
);

export default AppPromotionLotPageContainer(AppPromotionLotPage);
