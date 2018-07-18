// @flow
import React from 'react';

type CalculatedValueProps = {
  value: number,
  money: ?boolean,
};

const CalculatedValue = ({ value, money }: CalculatedValueProps) => (
  <div className="calculated-value">
    {money ? <span>CHF </span> : null}
    {value}
  </div>
);

export default CalculatedValue;
