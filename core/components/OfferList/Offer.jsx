import React from 'react';
import PropTypes from 'prop-types';

import { offerDelete } from '../../api';
import { T, IntlNumber } from '../Translation';
import ConfirmMethod from '../ConfirmMethod';

const Offer = ({ offer, offerValues }) => (
  <div className="offer-list-item">
    <h3>{offer.organization}</h3>
    <div className="offer-list-item-detail">
      {offerValues.map(({ key, component, format, value, id }) => {
        if (component) {
          return (
            <div className="offer-list-item-value" key={id || key}>
              {component}
            </div>
          );
        }

        return (
          <div className="value offer-list-item-value" key={id || key}>
            <label className="secondary" htmlFor={id || key}>
              <T id={`offer.${id || key}`} />
            </label>
            <h4 className="bold" id={id || key}>
              {/* if it has an id, it has a value */}
              {value || <IntlNumber value={offer[key]} format={format} />}
            </h4>
          </div>
        );
      })}
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
