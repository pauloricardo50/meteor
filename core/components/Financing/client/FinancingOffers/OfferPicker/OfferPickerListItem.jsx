// @flow
import React from 'react';
import cx from 'classnames';

type OfferPickerListItemProps = {};

const OfferPickerListItem = ({
  offer: {
    _id,
    organisation: { name, logo },
  },
  selected,
  updateStructure,
}: OfferPickerListItemProps) => (
  <div className={cx({ selected })} onClick={() => updateStructure(_id)}>
    <img src={logo} alt={name} />
  </div>
);

export default OfferPickerListItem;
