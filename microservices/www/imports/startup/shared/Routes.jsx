import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ScrollToTop from 'core/components/ScrollToTop';
import NotFound from 'core/components/NotFound';
import togglePoint, { TOGGLE_POINTS } from 'core/api/features/togglePoint';

import HomePage from '../../ui/pages/HomePage';
import AboutPage from '../../ui/pages/AboutPage';
import FaqPage from '../../ui/pages/FaqPage';
import ContactPage from '../../ui/pages/ContactPage';
import CareersPage from '../../ui/pages/CareersPage';
import ConditionsPage from '../../ui/pages/ConditionsPage';
import Widget1Page from '../../ui/pages/Widget1Page';
import Start2Page from '../../ui/pages/Start2Page';
import CheckMailboxPage from '../../ui/pages/CheckMailboxPage';
import InterestsPage from '../../ui/pages/InterestsPage';

const liteVersionModifier = togglePoint(TOGGLE_POINTS.ROUTES_CONFIG_STRIPPED_IN_LITE_VERSION);
const notProductionReadyModifier = togglePoint(TOGGLE_POINTS.ROUTES_NOT_PRODUCTION_READY);

const routesConfig = [
  { exact: true, path: '/', component: HomePage },
  { path: '/start/1', component: Widget1Page },
  { path: '/contact', component: ContactPage },

  ...liteVersionModifier([
    { path: '/conditions', component: ConditionsPage },
    { path: '/start/2', component: Start2Page },
    { path: '/checkYourMailbox/:email', component: CheckMailboxPage },
  ]),

  ...notProductionReadyModifier([
    { path: '/about', component: AboutPage },
    { path: '/faq', component: FaqPage },
    { path: '/careers', component: CareersPage },
    { path: '/interests', component: InterestsPage },
  ]),

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
