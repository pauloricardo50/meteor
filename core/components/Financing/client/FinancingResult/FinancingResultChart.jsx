import React from 'react';
import { compose } from 'recompose';
import cx from 'classnames';

import DonutChart from 'core/components/charts/DonutChart';
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
      <DonutChart
        data={[
          { value: interests, id: 'interests' },
          { value: amortization, id: 'amortization' },
          { value: propertyExpenses, id: 'maintenance' },
        ]}
        intlPrefix="general"
        config={{
          chart: {
            width: 100,
            height: 100,
            spacingBottom: 0,
            spacingTop: 0,
            spacingRight: 0,
            spacingLeft: 0,
          },
          plotOptions: {
            pie: {
              tooltip: {
                headerFormat: '<b>{point.key}</b><br />',
                pointFormat: 'CHF {point.y:,.0f}',
              },
              showInLegend: false,
              animation: false,
            },
          },
          legend: { enabled: false },
        }}
        title=""
      />
      <span className="total">
        <span className="chf">CHF </span>
        {toMoney(amortization + interests + propertyExpenses)}
      </span>
    </div>
  );
};

export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
)(FinancingResultChart);
