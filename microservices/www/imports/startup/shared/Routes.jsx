import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ScrollToTop from 'core/components/ScrollToTop';
import NotFound from 'core/components/NotFound';
import togglePoint, { TOGGLE_POINTS } from 'core/api/features/togglePoint';

import HomePage from '../../ui/pages/HomePage'; // Load this page instantly
import AboutPage from '../../ui/pages/AboutPage';
import FaqPage from '../../ui/pages/FaqPage/loadable';
import ContactPage from '../../ui/pages/ContactPage/loadable';
import CareersPage from '../../ui/pages/CareersPage/loadable';
import ConditionsPage from '../../ui/pages/ConditionsPage/loadable';
import Widget1Page from '../../ui/pages/Widget1Page';
import CheckMailboxPage from '../../ui/pages/CheckMailboxPage/loadable';
import InterestsPage from '../../ui/pages/InterestsPage/loadable';

const liteVersionModifier = togglePoint(TOGGLE_POINTS.ROUTES_CONFIG_STRIPPED_IN_LITE_VERSION);
const notProductionReadyModifier = togglePoint(TOGGLE_POINTS.ROUTES_NOT_PRODUCTION_READY);

const routesConfig = [
  { exact: true, path: '/', component: HomePage },
  { path: '/start/1', component: Widget1Page },
  { path: '/contact', component: ContactPage },
  { path: '/interests', component: InterestsPage },
  { path: '/careers', component: CareersPage },
  { path: '/about', component: AboutPage },
  { path: '/faq', component: FaqPage },

  ...liteVersionModifier([
    { path: '/conditions', component: ConditionsPage },
    { path: '/checkYourMailbox/:email', component: CheckMailboxPage },
  ]),

  ...notProductionReadyModifier([]),

  { component: NotFound },
];

const Routes = () => (
  <ScrollToTop>
    <Switch>
      {routesConfig.map((routeProps, index) => (
        <Route key={index} {...routeProps} />
      ))}
    </Switch>
  </ScrollToTop>
);

export default Routes;
