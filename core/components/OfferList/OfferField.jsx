//      
import React from 'react';

import { T, IntlNumber } from '../Translation';

                          

const OfferField = ({
  offer,
  offerValue: { key, component, format, value, id },
}                 ) => {
  if (component) {
    return <div className="offer-list-item-value">{component}</div>;
  }

  return (
    <div className="value offer-list-item-value">
      <label className="secondary" htmlFor={id || key}>
        <T id={`offer.${id || key}`} />
      </label>
      <h4 className="bold" id={id || key}>
        {/* if it has an id, it has a value */}
        {value || <IntlNumber value={offer[key]} format={format} />}
      </h4>
    </div>
  );
};

export default OfferField;
