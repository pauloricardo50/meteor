import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';

import CounterpartsOfferIcon from '../CounterpartsOfferIcon';
import OfferField from './OfferField';
import OfferModifier from './OfferModifier';
import OfferFeedback from './OfferFeedback';
import OfferDocuments from './OfferDocuments';

const Offer = ({ offer, offerValues }) => {
  const { enableOffer = true } = offer;
  return (
    <div className="offer-list-item-container">
      {Meteor.microservice === 'admin' && !enableOffer && (
        <div className="offer-list-item-overlay">
          <h1>Cette offre est désactivée</h1>
          <OfferModifier offer={offer} />
        </div>
      )}
      <div className={cx('offer-list-item', { blur: !enableOffer })}>
        {offer.withCounterparts && <CounterpartsOfferIcon />}
        <div className="flex-col center" style={{ padding: '16px' }}>
          <img src={offer.organisation.logo} alt={offer.organisation.name} />
          {offer.createdAt && (
            <b>{moment(offer.createdAt).format('D MMM YY')}</b>
          )}
        </div>
        <div className="offer-list-item-detail">
          {offerValues.map(offerValue => (
            <OfferField
              key={offerValue.key}
              offerValue={offerValue}
              offer={offer}
            />
          ))}
          {Meteor.microservice === 'admin' && (
            <div className="offer-list-item-actions">
              <OfferFeedback offer={offer} />
              <OfferModifier offer={offer} />
              <OfferDocuments offer={offer} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Offer.propTypes = {
  offer: PropTypes.objectOf(PropTypes.any).isRequired,
  offerValues: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default Offer;
