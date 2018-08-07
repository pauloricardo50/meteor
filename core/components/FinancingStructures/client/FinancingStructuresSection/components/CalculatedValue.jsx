// @flow
import React from 'react';
import cx from 'classnames';
import { compose } from 'recompose';

import { toMoney } from '../../../../../utils/conversionFunctions';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';
import { Percent } from '../../../../Translation';

type CalculatedValueProps = {
  value: number,
  format?: string,
  className: string,
  children?: React.Node,
};

export const FORMATS = {
  MONEY: 'MONEY',
  PERCENT: 'PERCENT',
  DEFAULT: 'DEFAULT',
};

const formatters = {
  [FORMATS.MONEY]: value => (
    <React.Fragment>
      <span className="chf">CHF</span>
      {toMoney(value)}
    </React.Fragment>
  ),
  [FORMATS.PERCENT]: value => <Percent value={value} />,
  [FORMATS.DEFAULT]: value => value,
};

const CalculatedValue = ({
  value,
  format = FORMATS.MONEY,
  className,
  children,
  ...props
}: CalculatedValueProps) => {
  const displayValue = typeof value === 'function' ? value(props) : value;

  return (
    <div className={cx('calculated-value', className)}>
      {children ? children(displayValue) : formatters[format](displayValue)}
    </div>
  );
};

export default compose(
  SingleStructureContainer,
  FinancingStructuresDataContainer({ asArrays: true }),
)(CalculatedValue);
