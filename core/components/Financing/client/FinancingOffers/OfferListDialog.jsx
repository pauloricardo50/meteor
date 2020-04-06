import React from 'react';

import DialogSimple from '../../../DialogSimple';
import OfferList from '../../../OfferList/OfferList';
import T from '../../../Translation';

const OfferListDialog = ({ offers, disabled }) => (
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
