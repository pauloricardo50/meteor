import React from 'react';
import { Route, Switch } from 'react-router-dom';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={() => <h1>Hello World</h1>} />
    <Route exact path="/2" component={() => <h1>Hello World 2</h1>} />
  </Switch>
);

export default Routes;
