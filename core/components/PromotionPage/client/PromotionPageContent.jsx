// @flow
import React from 'react';

import Switch from 'core/components/BaseRouter/Switch';
import Route from 'core/components/BaseRouter/Route';
import PromotionTimeline from './PromotionTimeline/PromotionTimeline';
import PromotionPartners from './PromotionPartners';
import PromotionFiles from './PromotionFiles';
import PromotionUsers from './PromotionUsers/loadable';
import PromotionCustomers from './PromotionCustomers/loadable';

type PromotionPageContentProps = {};

const PromotionPageContent = ({ promotion }: PromotionPageContentProps) => (
  <Switch>
    <Route
      exact
      path={['/promotions/:promotionId', '/promotions/:promotionId/overview']}
      component={PromotionTimeline}
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
