// @flow
import React from 'react';
import { Money } from '../Translation';

type MoneyRangeProps = {
  min: Number,
  max: Number,
};

const MoneyRange = ({ min, max }: MoneyRangeProps) => (
  <span>
    <Money value={min} />
    &nbsp;-&nbsp;
    <Money value={max} />
  </span>
);

export default MoneyRange;
