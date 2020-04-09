import React from 'react';

import { createRoute } from '../../../utils/routerUtils';
import Route from '../../BaseRouter/Route';
import Switch from '../../BaseRouter/Switch';
import PromotionCustomers from './PromotionCustomers/loadable';
import PromotionFiles from './PromotionFiles';
import PromotionManagement from './PromotionManagement/loadable';
import PromotionMap from './PromotionMap/loadable';
import PromotionPageOverview from './PromotionPageOverview';
import PromotionPartners from './PromotionPartners';
import PromotionUsers from './PromotionUsers/loadable';

const TABS_COMPONENTS = {
  map: PromotionMap,
  partners: PromotionPartners,
  files: PromotionFiles,
  users: PromotionUsers,
  customers: PromotionCustomers,
  management: PromotionManagement,
  overview: PromotionPageOverview,
};

const getRoutes = ({ tabs, route, props }) => {
  const [firstTab, ...otherTabs] = tabs;
  return [
    ...otherTabs.map(({ id }) => (
      <Route
        key={id}
        path={createRoute(route, { tabId: id })}
        component={TABS_COMPONENTS[id]}
        {...props}
      />
    )),
    <Route
      key={firstTab.id}
      path={createRoute(route, { tabId: '' })}
      component={TABS_COMPONENTS[firstTab.id]}
      {...props}
    />,
  ];
};

const PromotionPageContent = ({ route, tabs, ...props }) => (
  <Switch>{getRoutes({ tabs, route, props })}</Switch>
);
export default PromotionPageContent;
