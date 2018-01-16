import React from 'react';
import PropTypes from 'prop-types';
import { Route as RRRoute } from 'react-router-dom';

const Route = ({ path, component: MyComponent, ...rest }) => (
  <RRRoute
    path={path}
    render={routeProps => <MyComponent {...rest} {...routeProps} />}
  />
);

Route.propTypes = {};

export default Route;
