// @flow
import React from 'react';
import { Consumer } from './loan-context';

export default () => Component => props => (
  <Consumer>
    {loan => (
      <Component
        {...props}
        loan={loan}
        structures={loan.structures}
        borrowers={loan.borrowers}
        properties={loan.properties}
      />
    )}
  </Consumer>
);
