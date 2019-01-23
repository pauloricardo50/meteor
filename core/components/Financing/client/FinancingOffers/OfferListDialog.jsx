// @flow
import React from 'react';

import T from '../../../Translation';
import DialogSimple from '../../../DialogSimple';
import OfferList from '../../../OfferList/OfferList';

type OfferListDialogProps = {
  offers: Array<Object>,
};

const OfferListDialog = ({ offers }: OfferListDialogProps) => (
  <DialogSimple
    label={<T id="FinancingOffers.showAll" />}
    buttonProps={{ style: { margin: 8 } }}
    raised={false}
    primary
    closeOnly
    maxWidth={false}
  >
    <OfferList offers={offers} />
  </DialogSimple>
);

export default OfferListDialog;
