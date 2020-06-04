import React from 'react';

import Calculator from '../../../../utils/Calculator';
import { Consumer } from './loan-context';

export default Component => props => (
  <Consumer>
    {({ loan, Calculator: calc }) => {
      const offers = Calculator.selectOffers({ loan }).filter(
        ({ enableOffer }) => enableOffer,
      );

      return (
        <Component
          {...props}
          Calculator={calc}
          loan={loan}
          structures={loan.structures}
          borrowers={loan.borrowers}
          offers={offers}
          properties={loan.properties}
          promotionOptions={loan.promotionOptions}
        />
      );
    }}
  </Consumer>
);
