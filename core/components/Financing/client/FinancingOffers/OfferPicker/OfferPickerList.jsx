// @flow
import React from 'react';

import OfferPickerListItem from './OfferPickerListItem';

type OfferPickerListProps = {};

const OfferPickerList = ({
  offers,
  structure,
  updateStructure,
}: OfferPickerListProps) => (
  <div className="offer-picker-list">
    {offers.map(offer => (
      <OfferPickerListItem
        offer={offer}
        selected={structure.offerId === offer._id}
        updateStructure={updateStructure}
        key={offer._id}
      />
    ))}
  </div>
);

export default OfferPickerList;
