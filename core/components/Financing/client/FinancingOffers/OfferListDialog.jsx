// @flow
import React from 'react';

import T from '../../../Translation';
import DialogSimple from '../../../DialogSimple';
import OfferList from '../../../OfferList/OfferList';

type OfferListDialogProps = {
  offers: Array<Object>,
  disabled?: boolean,
};

const OfferListDialog = ({ offers, disabled }: OfferListDialogProps) => (
  <DialogSimple
    label={<T id="FinancingOffers.showAll" />}
    buttonProps={{ style: { margin: 8 }, disabled }}
    raised={false}
    primary
    closeOnly
    maxWidth={false}
  >
    <OfferList offers={offers} />
  </DialogSimple>
);

export default OfferListDialog;
