// @flow
import React from 'react';

import { withState } from 'recompose';

import OfferPickerListItem from './OfferPickerListItem';
import OfferPickerDialog from './OfferPickerDialog';

type OfferPickerListProps = {};

const OfferPickerList = ({
  offers,
  structure,
  updateStructure,
  dialogOffer,
  setDialogOffer,
}: OfferPickerListProps) => (
  <div className="offer-picker-list">
    {offers.map(offer => (
      <OfferPickerListItem
        offer={offer}
        selected={structure.offerId === offer._id}
        updateStructure={updateStructure}
        structure={structure}
        handleClick={() => setDialogOffer(offer._id)}
        key={offer._id}
      />
    ))}
    <OfferPickerDialog
      open={!!dialogOffer}
      handleClose={() => setDialogOffer('')}
      handleSelect={() =>
        updateStructure(dialogOffer).then(() => setDialogOffer(''))
      }
      offer={offers.find(({ _id }) => _id === dialogOffer)}
      structure={structure}
    />
  </div>
);

export default withState('dialogOffer', 'setDialogOffer', '')(OfferPickerList);
