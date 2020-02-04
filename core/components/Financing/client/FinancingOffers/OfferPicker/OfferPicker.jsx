//      
import React from 'react';

import OfferPickerList from './OfferPickerList';
import OfferPickerContainer from './OfferPickerContainer';
import OfferListDialog from '../OfferListDialog';

                           

const OfferPicker = (props                  ) => (
  <div className="offerId">
    <OfferListDialog offers={props.offers} />

    <OfferPickerList {...props} />
  </div>
);

export default OfferPickerContainer(OfferPicker);
