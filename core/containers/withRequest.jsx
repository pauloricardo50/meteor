import React from 'react';
import { contextTypes } from './RequestContainer';

/**
 * withRequest - Wraps a React component and injects the request context in it
 *
 * @param {Component} WrappedComponent A React component
 * @param {Array} contextKeys      Can take any of the allowed keys from
 * contextTypes, for example, if you only need the borrowers: ['borrowers'].
 * If no value is provided, it defaults to all of them
 *
 * @return {Component} The wrapped component
 */
const withRequest = (WrappedComponent, contextKeys) => {
  const RequestComponent = (props, context) => (
    <WrappedComponent {...props} {...context} />
  );

  RequestComponent.contextTypes = contextKeys
    ? contextKeys.reduce(
      (accumulator, type) => ({
        ...accumulator,
        [type]: contextTypes[type],
      }),
      {},
    )
    : contextTypes;

  return RequestComponent;
};

export default withRequest;
