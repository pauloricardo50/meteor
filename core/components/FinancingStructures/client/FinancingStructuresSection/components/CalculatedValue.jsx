// @flow
import React from 'react';
import cx from 'classnames';
import { compose } from 'recompose';

import { toMoney } from '../../../../../utils/conversionFunctions';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import StructuresContainer from '../../containers/StructuresContainer';

type CalculatedValueProps = {
  value: number,
  money?: boolean,
  className: string,
};

const CalculatedValue = ({
  value,
  money = true,
  className,
  ...props
}: CalculatedValueProps) => {
  const displayValue = typeof value === 'function' ? value(props) : value;

  return (
    <div className={cx('calculated-value', className)}>
      {money ? (
        <span>
          <span className="chf">
            {'CHF '}
          </span>
          {toMoney(displayValue)}
        </span>
      ) : (
        displayValue
      )}
    </div>
  );
};

export default compose(
  SingleStructureContainer,
  StructuresContainer,
)(CalculatedValue);
