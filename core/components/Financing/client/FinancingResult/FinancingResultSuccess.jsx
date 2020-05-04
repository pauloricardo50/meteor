import React from 'react';
import cx from 'classnames';
import { compose } from 'recompose';

import { toMoney } from '../../../../utils/conversionFunctions';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import {
  getAmortization,
  getInterests,
  getPropertyExpenses,
} from './financingResultHelpers';

const FinancingResultSuccess = ({ className, ...props }) => {
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
)(FinancingResultSuccess);
