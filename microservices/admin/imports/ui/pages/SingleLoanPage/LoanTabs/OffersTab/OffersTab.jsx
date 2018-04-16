import React from 'react';

import { T } from 'core/components/Translation';

import OfferList from 'core/components/OfferList';
import OfferAdder from './OfferAdder';

const OffersTab = props => (
  <div className="mask1 offers-tab">
    <h2>
      <T id="collections.offers" />
    </h2>
    <div className="offer-adder">
      <OfferAdder loanId={props.loan._id} />
    </div>
    <OfferList {...props} allowDelete />
  </div>
);

export default OffersTab;
