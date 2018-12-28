import React from 'react';
import PropTypes from 'prop-types';

import OfferField from './OfferField';
import OfferModifier from './OfferModifier';

const Offer = ({ offer, offerValues }) => (
  <div className="offer-list-item">
    <img src={offer.organisation.logo} alt={offer.organisation.name} />
    <div className="offer-list-item-detail">
      {offerValues.map(offerValue => (
        <OfferField
          key={offerValue.key}
          offerValue={offerValue}
          offer={offer}
        />
      ))}
      <OfferModifier offer={offer} />
    </div>
  </div>
);

Offer.propTypes = {
  offer: PropTypes.objectOf(PropTypes.any).isRequired,
  offerValues: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default Offer;
