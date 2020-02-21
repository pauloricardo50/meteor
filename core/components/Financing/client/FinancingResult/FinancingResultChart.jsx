import React from 'react';
import { compose } from 'recompose';
import cx from 'classnames';

import { toMoney } from 'core/utils/conversionFunctions';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import {
  getAmortization,
  getPropertyExpenses,
  getInterests,
} from './financingResultHelpers';

const FinancingResultChart = ({ className, ...props }) => {
  const interests = getInterests(props);
  const amortization = getAmortization(props);
  const propertyExpenses = getPropertyExpenses(props);

  return (
    <div className={cx('financing-structures-result-chart', className)}>
      <span className="total">
        <span className="chf">CHF </span>
        {toMoney(amortization + interests + propertyExpenses)}
        <small>&nbsp;/mois</small>
      </span>
    </div>
  );
};

export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
)(FinancingResultChart);
