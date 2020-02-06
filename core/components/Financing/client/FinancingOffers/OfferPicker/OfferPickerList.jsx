import React from 'react';
import { withState, compose } from 'recompose';
import FlipMove from 'react-flip-move';

import OfferPickerListItem from './OfferPickerListItem';
import OfferPickerDialog from './OfferPickerDialog';

const OfferPickerList = ({
  offers,
  structure,
  updateStructure,
  dialogOffer,
  setDialogOffer,
  hovering,
  setHovering,
  ...data
}) => (
  <div
    className="offer-picker-list"
    onMouseEnter={() => setHovering(true)}
    onMouseLeave={() => setHovering(false)}
  >
    <FlipMove>
      {offers.map(offer => (
        <OfferPickerListItem
          key={offer._id}
          offer={offer}
          selected={structure.offerId === offer._id}
          updateStructure={updateStructure}
          structure={structure}
          handleClick={() => {
            // onMouseLeave is not called when the dialog takes up the whole screen
            setHovering(false);
            setDialogOffer(offer._id);
          }}
          displayDetail={hovering}
          {...data}
        />
      ))}
    </FlipMove>

    <OfferPickerDialog
      open={!!dialogOffer}
      handleClose={() => setDialogOffer('')}
      handleSelect={() =>
        updateStructure(dialogOffer).then(() => setDialogOffer(''))
      }
      handleDeselect={() => {
        updateStructure('');
        setDialogOffer('');
      }}
      offer={offers.find(({ _id }) => _id === dialogOffer)}
      selected={structure.offerId === dialogOffer}
      structure={structure}
      {...data}
    />
  </div>
);

export default compose(
  withState('dialogOffer', 'setDialogOffer', ''),
  withState('hovering', 'setHovering', false),
)(OfferPickerList);
