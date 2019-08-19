// @flow
import React from 'react';

import { createRoute } from '../../../utils/routerUtils';
import Switch from '../../BaseRouter/Switch';
import Route from '../../BaseRouter/Route';
import PromotionPageOverview from './PromotionPageOverview';
import PromotionPartners from './PromotionPartners';
import PromotionFiles from './PromotionFiles';
import PromotionUsers from './PromotionUsers/loadable';
import PromotionCustomers from './PromotionCustomers/loadable';
import PromotionMap from './PromotionMap/loadable';

type PromotionPageContentProps = {};

const PromotionPageContent = ({
  promotion,
  route,
}: PromotionPageContentProps) => (
  <Switch>
    <Route
      exact
      path={[route, createRoute(route, { tabId: 'overview' })]}
      component={PromotionPageOverview}
      promotion={promotion}
    />
    <Route
      path={createRoute(route, { tabId: 'map' })}
      component={PromotionMap}
      promotion={promotion}
    />
    <Route
      path={createRoute(route, { tabId: 'partners' })}
      component={PromotionPartners}
      promotion={promotion}
    />
    <Route
      path={createRoute(route, { tabId: 'files' })}
      component={PromotionFiles}
      promotion={promotion}
    />
    <Route
      path={createRoute(route, { tabId: 'users' })}
      component={PromotionUsers}
      promotion={promotion}
    />
    <Route
      path={createRoute(route, { tabId: 'customers' })}
      component={PromotionCustomers}
      promotion={promotion}
    />
  </Switch>
);

export default PromotionPageContent;
