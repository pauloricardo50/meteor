// @flow
import React from 'react';

import Dialog from '../../../../Material/Dialog';
import T from '../../../../Translation';
import Button from '../../../../Button';

type OfferPickerDialogProps = {};

const OfferPickerDialog = ({
  open,
  handleClose,
  handleSelect,
}: OfferPickerDialogProps) => (
  <Dialog
    open={open}
    onClose={handleClose}
    title={<T id="FinancingOffers.dialogTitle" />}
    actions={[
      <Button
        label={<T id="general.close" onClick={handleClose} />}
        key="close"
      />,
      <Button
        raised
        primary
        label={<T id="general.choose" onClick={handleSelect} />}
        key="choose"
      />,
    ]}
  />
);

export default OfferPickerDialog;
