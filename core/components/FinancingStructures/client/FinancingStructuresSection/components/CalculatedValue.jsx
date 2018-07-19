// @flow
import React from 'react';

import { toMoney } from '../../../../../utils/conversionFunctions';
import SingleStructureContainer from '../../containers/SingleStructureContainer';

type CalculatedValueProps = {
  value: number,
  money: ?boolean,
};

const CalculatedValue = ({ value, money, ...props }: CalculatedValueProps) => {
  const displayValue = typeof value === 'function' ? value(props) : value;

  return (
    <div className="calculated-value">
      {money ? <span>CHF {toMoney(displayValue)}</span> : displayValue}
    </div>
  );
};

export default SingleStructureContainer(CalculatedValue);
