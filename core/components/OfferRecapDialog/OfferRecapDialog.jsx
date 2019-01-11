// @flow
import React from 'react';

import Dialog from '../Material/Dialog';
import Button from '../Button';
import T from '../Translation';
import OfferRecapDialogContainer from './OfferRecapDialogContainer';
import OfferRecapDialogContent from './OfferRecapDialogContent';

type OfferRecapDialogProps = {
  open: Boolean,
  handleClose: Function,
  offerDialog: Object,
};

const OfferRecapDialog = ({
  open,
  handleClose,
  offerDialog,
}: OfferRecapDialogProps) => (
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
