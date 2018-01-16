import React from 'react';
import PropTypes from 'prop-types';
import { Route as RRRoute } from 'react-router-dom';

const Route = ({
  exact, path, render, component: MyComponent, ...rest
}) => (
  <RRRoute
    exact={exact}
    path={path}
    render={
      MyComponent
        ? routeProps => <MyComponent {...rest} {...routeProps} />
        : render
    }
  />
);

Route.propTypes = {};

export default Route;
