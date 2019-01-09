import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import OfferField from './OfferField';
import OfferModifier from './OfferModifier';

const Offer = ({ offer, offerValues }) => (
  <div className="offer-list-item">
    <div className="flex-col center" style={{ padding: '16px' }}>
      <img src={offer.organisation.logo} alt={offer.organisation.name} />
      {offer.createdAt && <b>{moment(offer.createdAt).format('DD.MM.YYYY')}</b>}
    </div>
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
