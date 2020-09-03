import React from 'react';
import { Route as RRRoute } from 'react-router-dom';

const Route = ({
  exact,
  path,
  render,
  component: MyComponent,
  routeName,
  ...rest
}) => (
  <RRRoute
    exact={exact}
    path={path}
    render={
      MyComponent
        ? routeProps => <MyComponent {...rest} {...routeProps} />
        : renderProps => render({ ...renderProps, ...rest })
    }
  />
);
Route.propTypes = {};

export default Route;
