import React from 'react';

import { T } from 'core/components/Translation';

import OfferAdder from './OfferAdder';
import OffersList from './OffersList';

const OffersTab = props => (
  <div className="mask1">
    <h2>
      <T id="collections.offers" />
    </h2>
    <OfferAdder loanId={props.loan._id} />
    <OffersList {...props} />
  </div>
);

export default OffersTab;
