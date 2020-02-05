//
import React from 'react';

import { Consumer } from './loan-context';
import memoizeOne from '../../../../utils/memoizeOne';

const filterOffers = memoizeOne(offers =>
  offers && !!offers.length
    ? offers.filter(({ enableOffer = true }) => enableOffer)
    : [],
);

export default Component => props => (
  <Consumer>
    {({ loan, Calculator }) => (
      <Component
        {...props}
        Calculator={Calculator}
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
