import React from 'react';
import { Route, Switch } from 'react-router-dom';

import HomePage from '../../ui/pages/HomePage';
import AboutPage from '../../ui/pages/AboutPage';
import Widget1Page from '../../ui/pages/Widget1Page';

const Routes = () => (
  <Switch>
    <Route path="/about" component={AboutPage} />
    <Route exact path="/" component={HomePage} />
    <Route exact path="/start/1" component={Widget1Page} />
  </Switch>
);

export default Routes;
