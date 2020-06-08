import React from 'react';

const OfferPickerListItemValue = ({
  label,
  value,
  valueProps = {},
  labelProps = {},
}) => (
  <>
    <p className="secondary" {...labelProps}>
      {label}
    </p>
    <h4 className="font-size-5" {...valueProps}>
      {value}
    </h4>
  </>
);

export default OfferPickerListItemValue;
