import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ScrollToTop from 'core/components/ScrollToTop';
import togglePoint, { TOGGLE_POINTS } from 'core/api/features/togglePoint';
import NotFound from 'core/components/NotFound';

import HomePage from '../../ui/pages/HomePage';
import AboutPage from '../../ui/pages/AboutPage';
import FaqPage from '../../ui/pages/FaqPage';
import ContactPage from '../../ui/pages/ContactPage';
import CareersPage from '../../ui/pages/CareersPage';
import ConditionsPage from '../../ui/pages/ConditionsPage';
import Widget1Page from '../../ui/pages/Widget1Page';
import Start2Page from '../../ui/pages/Start2Page';
import CheckMailboxPage from '../../ui/pages/CheckMailboxPage';

const routesConfig = [
  { exact: true, path: '/', component: HomePage },
  { path: '/start/1', component: Widget1Page },
  { path: '/about', component: AboutPage },
  { path: '/faq', component: FaqPage },
  { path: '/contact', component: ContactPage },
  { path: '/conditions', component: ConditionsPage },

  ...togglePoint({
    id: TOGGLE_POINTS.LITE_VERSION_ROUTES_OFF,
    code: [
      { path: '/start/2', component: Start2Page },
      { path: '/careers', component: CareersPage },
      { path: '/checkYourMailbox/:email', component: CheckMailboxPage },
    ],
  }),

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
