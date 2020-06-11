import React from 'react';

import DialogSimple from '../../../DialogSimple';
import OfferList from '../../../OfferList/OfferList';
import T from '../../../Translation';

const OfferListDialog = ({ loan, disabled }) => (
  <DialogSimple
    label={<T id="FinancingOffers.showAll" />}
    title={<T id="FinancingOffers.dialogTitle" />}
    buttonProps={{ style: { marginBottom: 8 }, disabled }}
    raised={false}
    primary
    closeOnly
    maxWidth={false}
  >
    <OfferList loan={loan} />
  </DialogSimple>
);

export default OfferListDialog;
