import React from 'react';
import { Route, Switch } from 'react-router-dom';

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
  <Switch>
    <Route path="/start/1" component={Widget1Page} />
    <Route path="/start/2" component={Start2Page} />
    <Route path="/checkYourMailbox/:email" component={CheckMailboxPage} />
    <Route path="/about" component={AboutPage} />
    <Route path="/faq" component={FaqPage} />
    <Route path="/contact" component={ContactPage} />
    <Route path="/careers" component={CareersPage} />
    <Route path="/conditions" component={ConditionsPage} />
    <Route exact path="/" component={HomePage} />
  </Switch>
);

export default Routes;
