import React from 'react';
import PropTypes from 'prop-types';

import { offerDelete } from '../../api';
import ConfirmMethod from '../ConfirmMethod';
import OfferField from './OfferField';

const Offer = ({ offer, offerValues }) => (
  <div className="offer-list-item">
    <h3>{offer.organization}</h3>
    <div className="offer-list-item-detail">
      {offerValues.map(offerValue => (
        <OfferField key={offer._id} offerValue={offerValue} offer={offer} />
      ))}
      <ConfirmMethod
        label="Supprimer"
        keyword="Supprimer"
        method={() => offerDelete.run({ offerId: offer.id })}
      />
    </div>
  </div>
);

Offer.propTypes = {
  offer: PropTypes.objectOf(PropTypes.any).isRequired,
  offerValues: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default Offer;
