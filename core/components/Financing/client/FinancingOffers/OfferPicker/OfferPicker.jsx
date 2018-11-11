// @flow
import React from 'react';

import OfferPickerList from './OfferPickerList';
import OfferPickerContainer from './OfferPickerContainer';

type OfferPickerProps = {};

const OfferPicker = (props: OfferPickerProps) => (
  <div className="offerId">
    <OfferPickerList {...props} />
  </div>
);

export default OfferPickerContainer(OfferPicker);
