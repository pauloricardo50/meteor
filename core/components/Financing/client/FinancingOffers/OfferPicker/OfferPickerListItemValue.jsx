// @flow
import React from 'react';

type OfferPickerListItemValueProps = {};

const OfferPickerListItemValue = ({
  label,
  value,
  valueProps = {},
  labelProps = {},
}: OfferPickerListItemValueProps) => (
  <>
    <p className="secondary" {...labelProps}>
      {label}
    </p>
    <h5 {...valueProps}>{value}</h5>
  </>
);

export default OfferPickerListItemValue;
