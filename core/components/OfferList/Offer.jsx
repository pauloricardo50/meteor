import { Meteor } from 'meteor/meteor';

import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';

import Calculator from '../../utils/Calculator';
import CounterpartsOfferIcon from '../CounterpartsOfferIcon';
import OfferDocuments from './OfferDocuments';
import OfferFeedback from './OfferFeedback';
import OfferField from './OfferField';
import OfferModifier from './OfferModifier';

const Offer = ({ offer, offerValues, loan }) => {
  const { _id: offerId, enableOffer = true } = offer;
  const lender = Calculator.selectLenderForOfferId({ loan, offerId });

  return (
    <div className="offer-list-item-container">
      {Meteor.microservice === 'admin' && !enableOffer && (
        <div className="offer-list-item-overlay">
          <h1>Cette offre est désactivée</h1>
          <OfferModifier offer={offer} title="Modifier offre" />
        </div>
      )}

      <div className={cx('offer-list-item', { blur: !enableOffer })}>
        {offer.withCounterparts && <CounterpartsOfferIcon />}

        <div className="flex-col center" style={{ padding: '16px' }}>
          <img src={lender.organisation.logo} alt={lender.organisation.name} />
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
              <OfferFeedback offer={offer} loan={loan} />
              <OfferModifier offer={offer} title="Modifier offre" />
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
