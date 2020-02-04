//      
import React from 'react';

import T, { Percent } from '../../../../Translation';
import OfferPickerListItemValue from './OfferPickerListItemValue';

                                            

const OfferPickerListItemInterests = ({
  offer,
  structure: { loanTranches },
  displayDetail,
}                                   ) => {
  if (offer.hasInvalidInterestRates) {
    return (
      <OfferPickerListItemValue
        label={<T id="FinancingOffers.interests" />}
        value={
          <T
            id="FinancingOffers.invalidRate"
            values={{
              rate: <T id={`offer.${offer.hasInvalidInterestRates}.short`} />,
            }}
          />
        }
        valueProps={{ className: 'error' }}
      />
    );
  }

  if (displayDetail) {
    return (
      <div className="flex-row wrap">
        {loanTranches.map(({ type }) => (
          <div className="flex-col single-rate" key={type}>
            <OfferPickerListItemValue
              label={<T id={`offer.${type}.short`} />}
              labelProps={{ className: '' }}
              value={<Percent value={offer[type]} />}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <OfferPickerListItemValue
      label={<T id="offer.averagedInterestRate" />}
      value={<Percent value={offer.averagedRate} />}
    />
  );
};

export default OfferPickerListItemInterests;
