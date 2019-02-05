// @flow
import React from 'react';

import OfferPickerList from './OfferPickerList';
import OfferPickerContainer from './OfferPickerContainer';
import OfferListDialog from '../OfferListDialog';

type OfferPickerProps = {};

const OfferPicker = (props: OfferPickerProps) => (
  <div className="offerId">
    <div className="flex center">
      <OfferListDialog offers={props.offers} />
    </div>

    <OfferPickerList {...props} />
  </div>
);

export default OfferPickerContainer(OfferPicker);
