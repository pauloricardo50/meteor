import React from 'react';
import { Route } from 'react-router-dom';

const Routes = () => (
  <Route exact path="/" component={() => <h1>Hello World</h1>} />
);

export default Routes;
