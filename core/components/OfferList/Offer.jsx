import React from 'react';
import PropTypes from 'prop-types';

import { offerDelete } from '../../api';
import ConfirmMethod from '../ConfirmMethod';
import OfferField from './OfferField';
import OfferModifier from './OfferModifier';

const Offer = ({ offer, offerValues }) => {
  console.log('offer', offer);

  return (
    <div className="offer-list-item">
      <img src={offer.organisation.logo} alt={offer.organisation.name} />
      <div className="offer-list-item-detail">
        {offerValues.map(offerValue => (
          <OfferField key={offer._id} offerValue={offerValue} offer={offer} />
        ))}
        <OfferModifier offer={offer} />
        <ConfirmMethod
          label="Supprimer"
          keyword="Supprimer"
          method={() => offerDelete.run({ offerId: offer.id })}
        />
      </div>
    </div>
  );
};

Offer.propTypes = {
  offer: PropTypes.objectOf(PropTypes.any).isRequired,
  offerValues: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default Offer;
