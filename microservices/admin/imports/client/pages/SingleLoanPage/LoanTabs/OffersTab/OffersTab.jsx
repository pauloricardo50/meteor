import React from 'react';

import T from 'core/components/Translation';

import OfferList from 'core/components/OfferList';
import OfferAdder from './OfferAdder';

const OffersTab = props => (
  <div className="offers-tab">
    <h2>
      <T id="collections.offers" />
    </h2>
    <div className="offer-adder">
      <OfferAdder loanId={props.loan._id} />
    </div>
    {props.offers && props.offers.length > 0 ?
      <OfferList {...props} allowDelete />
      :
      <h3 className="secondary text-center">Pas d'offres pour l'instant</h3>
    }
  </div>
);

export default OffersTab;
