// @flow
import React from 'react';

import { withState, compose } from 'recompose';

import OfferPickerListItem from './OfferPickerListItem';
import OfferPickerDialog from './OfferPickerDialog';

type OfferPickerListProps = {};

const OfferPickerList = ({
  offers,
  structure,
  updateStructure,
  dialogOffer,
  setDialogOffer,
  hovering,
  setHovering,
  ...data
}: OfferPickerListProps) => (
  <div
    className="offer-picker-list"
    onMouseEnter={() => setHovering(true)}
    onMouseLeave={() => setHovering(false)}
  >
    {offers.map(offer => (
      <OfferPickerListItem
        key={offer._id}
        offer={offer}
        selected={structure.offerId === offer._id}
        updateStructure={updateStructure}
        structure={structure}
        handleClick={() => {
          setHovering(false);
          setDialogOffer(offer._id);
        }}
        displayDetail={hovering}
        {...data}
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
      {...data}
    />
  </div>
);

export default compose(
  withState('dialogOffer', 'setDialogOffer', ''),
  withState('hovering', 'setHovering', false),
)(OfferPickerList);
