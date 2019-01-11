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
    <h4 {...valueProps}>{value}</h4>
  </>
);

export default OfferPickerListItemValue;
