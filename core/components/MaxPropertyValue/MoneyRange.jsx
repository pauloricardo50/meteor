// @flow
import React from 'react';
import { Money } from '../Translation';

type MoneyRangeProps = {
  min: Number,
  max: Number,
};

const MoneyRange = ({ min, max }: MoneyRangeProps) => (
  <>
    <td className="money-range">
      <Money value={min} />
    </td>
    <td>-</td>
    <td className="money-range">
      <Money value={max} />
    </td>
  </>
);

export default MoneyRange;
