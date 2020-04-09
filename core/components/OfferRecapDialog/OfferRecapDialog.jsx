import React from 'react';

import Button from '../Button';
import Dialog from '../Material/Dialog';
import T from '../Translation';
import OfferRecapDialogContainer from './OfferRecapDialogContainer';
import OfferRecapDialogContent from './OfferRecapDialogContent';

const OfferRecapDialog = ({ open, handleClose, offerDialog }) => (
  <Dialog
    open={open}
    onClose={handleClose}
    actions={[
      <Button
        label={<T id="general.close" />}
        onClick={handleClose}
        key="close"
      />,
    ]}
  >
    {!!offerDialog && <OfferRecapDialogContent offer={offerDialog} />}
  </Dialog>
);

export default OfferRecapDialogContainer(OfferRecapDialog);
