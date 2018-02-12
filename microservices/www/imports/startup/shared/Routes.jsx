import React from 'react';
import { Route, Switch } from 'react-router-dom';

import HomePage from '../../ui/pages/HomePage';
import AboutPage from '../../ui/pages/AboutPage';

const Routes = () => (
  <Switch>
    <Route path="/about" component={AboutPage} />
    <Route exact path="/" component={HomePage} />
  </Switch>
);

export default Routes;
