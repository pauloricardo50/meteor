import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ScrollToTop from 'core/components/ScrollToTop';
import TogglePoint, { TOGGLE_POINTS } from 'core/components/TogglePoint';
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

const Routes = () => (
  <ScrollToTop>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/start/1" component={Widget1Page} />
      <Route path="/about" component={AboutPage} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/conditions" component={ConditionsPage} />
      <TogglePoint id={TOGGLE_POINTS.LITE_VERSION_OFF}>
        <Route path="/start/2" component={Start2Page} />
        <Route path="/careers" component={CareersPage} />
        <Route path="/checkYourMailbox/:email" component={CheckMailboxPage} />
      </TogglePoint>
      <Route component={NotFound} />
    </Switch>
  </ScrollToTop>
);

export default Routes;
