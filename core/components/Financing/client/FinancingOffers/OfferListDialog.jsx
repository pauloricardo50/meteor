//      
import React from 'react';

import T from '../../../Translation';
import DialogSimple from '../../../DialogSimple';
import OfferList from '../../../OfferList/OfferList';

                             
                        
                     
  

const OfferListDialog = ({ offers, disabled }                      ) => (
  <DialogSimple
    label={<T id="FinancingOffers.showAll" />}
    buttonProps={{ style: { marginBottom: 8 }, disabled }}
    raised={false}
    primary
    closeOnly
    maxWidth={false}
  >
    <OfferList offers={offers} />
  </DialogSimple>
);

export default OfferListDialog;
