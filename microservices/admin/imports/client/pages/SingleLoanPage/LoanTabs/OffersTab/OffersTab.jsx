import React from 'react';

import T from 'core/components/Translation';

import OfferList from 'core/components/OfferList';
import OfferAdder from 'core/components/OfferAdder';

const OffersTab = (props) => {
  const {
    loan: { _id: loanId, offers },
  } = props;
  return (
    <div className="offers-tab">
      <h2>
        <T id="collections.offers" />
      </h2>
      <div className="offer-adder">
        <OfferAdder loanId={loanId} />
      </div>
      {offers && offers.length > 0 ? (
        <OfferList {...props} allowDelete />
      ) : (
        <h3 className="secondary text-center">Pas d'offres pour l'instant</h3>
      )}
    </div>
  );
};

export default OffersTab;
