import React from 'react';
import cx from 'classnames';
import { compose } from 'recompose';

import { toMoney } from '../../../../../utils/conversionFunctions';
import { Percent } from '../../../../Translation';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import SingleStructureContainer from '../../containers/SingleStructureContainer';

export const FORMATS = {
  MONEY: 'MONEY',
  PERCENT: 'PERCENT',
  DEFAULT: 'DEFAULT',
};

const formatters = {
  [FORMATS.MONEY]: value => (
    <>
      <span className="chf">CHF</span>
      {toMoney(value)}
    </>
  ),
  [FORMATS.PERCENT]: value => <Percent value={value} />,
  [FORMATS.DEFAULT]: value => value,
};

export const CalculatedValue = ({
  value,
  format = FORMATS.MONEY,
  className,
  children,
  rightElement,
  ...props
}) => {
  const displayValue = typeof value === 'function' ? value(props) : value;

  return (
    <div className={cx('calculated-value', className)}>
      {children ? children(displayValue) : formatters[format](displayValue)}
      {rightElement ? rightElement(displayValue) : null}
    </div>
  );
};

export default compose(
  SingleStructureContainer,
  FinancingDataContainer,
  React.memo,
)(CalculatedValue);
