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
import PromotionManagement from './PromotionManagement/loadable';

type PromotionPageContentProps = {};

const PromotionPageContent = ({
  route,
  ...props
}: PromotionPageContentProps) => (
  <Switch>
    <Route
      path={createRoute(route, { tabId: 'map' })}
      component={PromotionMap}
      {...props}
    />
    <Route
      path={createRoute(route, { tabId: 'partners' })}
      component={PromotionPartners}
      {...props}
    />
    <Route
      path={createRoute(route, { tabId: 'files' })}
      component={PromotionFiles}
      {...props}
    />
    <Route
      path={createRoute(route, { tabId: 'users' })}
      component={PromotionUsers}
      {...props}
    />
    <Route
      path={createRoute(route, { tabId: 'customers' })}
      component={PromotionCustomers}
      {...props}
    />
    <Route
      path={createRoute(route, { tabId: 'management' })}
      component={PromotionManagement}
      {...props}
    />
    <Route
      path={[createRoute(route, { tabId: '' })]}
      component={PromotionPageOverview}
      {...props}
    />
  </Switch>
);

export default PromotionPageContent;
