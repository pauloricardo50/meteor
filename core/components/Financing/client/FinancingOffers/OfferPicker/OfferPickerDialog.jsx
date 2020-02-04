//      
import React from 'react';

import { lifecycle } from 'recompose';
import Dialog from '../../../../Material/Dialog';
import T from '../../../../Translation';
import Button from '../../../../Button';
import OfferPickerDialogContent from './OfferPickerDialogContent';

                                 

const OfferPickerDialog = (props                        ) => {
  const {
    open,
    handleClose,
    handleSelect,
    handleDeselect,
    offer,
    selected,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      actions={[
        <Button
          label={<T id="general.close" />}
          onClick={handleClose}
          key="close"
        />,
        selected ? (
          <Button
            label={<T id="FinancingOffers.deselect" />}
            onClick={handleDeselect}
            key="close"
            error
          />
        ) : null,
        <Button
          raised
          primary
          label={<T id="general.choose" />}
          onClick={handleSelect}
          key="choose"
        />,
      ]}
    >
      {offer && <OfferPickerDialogContent {...props} />}
    </Dialog>
  );
};

export default lifecycle({
  UNSAFE_componentWillReceiveProps({ offer: nextOffer }) {
    const { offer } = this.props;
    // Cache the last offer, to avoid jerky visuals in the dialog
    // Because the dialog takes 500ms to fade out, the offer first disappears
    // and then the dialog slowly fades out, which looks really bad
    if (!offer && nextOffer) {
      this.setState({ offer: nextOffer });
    }
  },
})(OfferPickerDialog);
