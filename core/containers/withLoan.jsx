import React from 'react';
import { contextTypes } from './LoanContainer';

/**
 * withLoan - Wraps a React component and injects the loan context in it
 *
 * @param {Component} WrappedComponent A React component
 * @param {Array} contextKeys      Can take any of the allowed keys from
 * contextTypes, for example, if you only need the borrowers: ['borrowers'].
 * If no value is provided, it defaults to all of them
 *
 * @return {Component} The wrapped component
 */
const withLoan = (WrappedComponent, contextKeys) => {
  const LoanComponent = (props, context) => (
    <WrappedComponent {...props} {...context} />
  );
  LoanComponent.contextTypes = contextKeys
    ? contextKeys.reduce(
      (accumulator, type) => ({
        ...accumulator,
        [type]: contextTypes[type],
      }),
      {},
    )
    : contextTypes;

  return LoanComponent;
};

export default withLoan;
