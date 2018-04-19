import React from 'react';
import { renderComponent } from 'recompose';

export const elementToComponent = element => props =>
  React.cloneElement(element, props);

export const childrenToComponent = children => props =>
  React.Children.map(children, child => React.cloneElement(child, props));

export const renderObjectOrFunction = objectOrFunction =>
  renderComponent(typeof objectOrFunction === 'function'
    ? objectOrFunction
    : () => objectOrFunction);
