import React from 'react';

export const elementToComponent = element => props =>
  React.cloneElement(element, props);

export const childrenToComponent = children => props =>
  React.Children.map(children, child => React.cloneElement(child, props));
