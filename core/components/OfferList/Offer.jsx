import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import OfferField from './OfferField';
import OfferModifier from './OfferModifier';
import OfferFeedback from './OfferFeedback';
import CounterpartsOfferIcon from '../CounterpartsOfferIcon';

const Offer = ({ offer, offerValues }) => (
  <div className="offer-list-item">
    {offer.withCounterparts && <CounterpartsOfferIcon />}
    <div className="flex-col center" style={{ padding: '16px' }}>
      <img src={offer.organisation.logo} alt={offer.organisation.name} />
      {offer.createdAt && <b>{moment(offer.createdAt).format('D MMM YY')}</b>}
    </div>
    <div className="offer-list-item-detail">
      {offerValues.map(offerValue => (
        <OfferField
          key={offerValue.key}
          offerValue={offerValue}
          offer={offer}
        />
      ))}
      <div className="offer-list-item-actions">
        <OfferFeedback offer={offer} />
        <OfferModifier offer={offer} />
      </div>
    </div>
  </div>
);

Offer.propTypes = {
  offer: PropTypes.objectOf(PropTypes.any).isRequired,
  offerValues: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default Offer;
