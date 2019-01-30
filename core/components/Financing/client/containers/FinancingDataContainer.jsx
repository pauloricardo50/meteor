// @flow
import React from 'react';
import { Consumer } from './loan-context';

export default Component => props => (
  <Consumer>
    {loan => (
      <Component
        {...props}
        loan={loan}
        structures={loan.structures}
        borrowers={loan.borrowers}
        offers={loan.offers.filter(({ enableOffer = true }) => enableOffer)}
        properties={loan.properties}
        promotionOptions={loan.promotionOptions}
      />
    )}
  </Consumer>
);
