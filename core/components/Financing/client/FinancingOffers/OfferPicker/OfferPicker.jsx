import React from 'react';

import OfferListDialog from '../OfferListDialog';
import OfferPickerContainer from './OfferPickerContainer';
import OfferPickerList from './OfferPickerList';

const OfferPicker = props => (
  <div className="offerId">
    <OfferListDialog loan={props.loan} />

    <OfferPickerList {...props} />
  </div>
);

export default OfferPickerContainer(OfferPicker);
