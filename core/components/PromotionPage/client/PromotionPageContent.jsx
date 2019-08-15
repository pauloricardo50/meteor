// @flow
import React from 'react';

import Switch from '../../BaseRouter/Switch';
import Route from '../../BaseRouter/Route';
import PromotionPageOverview from './PromotionPageOverview';
import PromotionPartners from './PromotionPartners';
import PromotionFiles from './PromotionFiles';
import PromotionUsers from './PromotionUsers/loadable';
import PromotionCustomers from './PromotionCustomers/loadable';
import PromotionMap from './PromotionMap/loadable';

type PromotionPageContentProps = {};

const PromotionPageContent = ({ promotion }: PromotionPageContentProps) => (
  <Switch>
    <Route
      exact
      path={['/promotions/:promotionId', '/promotions/:promotionId/overview']}
      component={PromotionPageOverview}
      promotion={promotion}
    />
    <Route
      path="/promotions/:promotionId/map"
      component={PromotionMap}
      promotion={promotion}
    />
    <Route
      path="/promotions/:promotionId/partners"
      component={PromotionPartners}
      promotion={promotion}
    />
    <Route
      path="/promotions/:promotionId/files"
      component={PromotionFiles}
      promotion={promotion}
    />
    <Route
      path="/promotions/:promotionId/users"
      component={PromotionUsers}
      promotion={promotion}
    />
    <Route
      path="/promotions/:promotionId/customers"
      component={PromotionCustomers}
      promotion={promotion}
    />
  </Switch>
);

export default PromotionPageContent;
