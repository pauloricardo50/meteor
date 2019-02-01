// @flow
import React from 'react';
import { Consumer } from './loan-context';

const filterOffers = offers =>
  (offers && !!offers.length
    ? offers.filter(({ enableOffer = true }) => enableOffer)
    : []);

export default Component => props => (
  <Consumer>
    {loan => (
      <Component
        {...props}
        loan={loan}
        structures={loan.structures}
        borrowers={loan.borrowers}
        offers={filterOffers(loan.offers)}
        properties={loan.properties}
        promotionOptions={loan.promotionOptions}
      />
    )}
  </Consumer>
);
