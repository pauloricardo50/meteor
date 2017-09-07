import React from 'react';
import PropTypes from 'prop-types';

import { T, IntlNumber } from '/imports/ui/components/general/Translation.jsx';
import colors from '/imports/js/config/colors';

const InterestRanges = ({ offers, style }) => {
  const combinedOffers = [
    ...offers.map(o => o.standardOffer || {}),
    ...offers.map(o => o.counterpartOffer || {}),
  ];

  const rates = combinedOffers.reduce((ratesObject, offer) => {
    if (offer) {
      Object.keys(offer).map((key) => {
        // Get all keys that have interest in their name
        // Add their values to the respective array in an object
        if (key.indexOf('interest') >= 0) {
          if (ratesObject[key]) {
            ratesObject[key].push(offer[key]);
          } else {
            ratesObject[key] = [offer[key]];
          }
        }
      });
    }

    return ratesObject;
  }, {});

  return (
    <div className="flex-col center" style={style}>
      <h3
        style={{
          borderBottom: `1px solid ${colors.lightBorder}`,
          paddingBottom: 8,
          marginBottom: 16,
          width: '100%',
        }}
        className="text-center"
      >
        <T id="InterestRanges.title" />
      </h3>
      {Object.keys(rates).map(rate =>
        (<div
          className="flex"
          style={{
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 8,
          }}
          key={rate}
        >
          <span className="bold">
            <T id={`offer.${rate}`} />
          </span>
          <span>
            <IntlNumber value={Math.min(...rates[rate])} format="percentage" />
            {' - '}
            <IntlNumber value={Math.max(...rates[rate])} format="percentage" />
          </span>
        </div>),
      )}
    </div>
  );
};

InterestRanges.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default InterestRanges;
