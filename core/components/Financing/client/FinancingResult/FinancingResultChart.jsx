// @flow
import React from 'react';
import DonutChart from 'core/components/charts/DonutChart';
import { toMoney } from 'core/utils/conversionFunctions';
import { compose } from 'recompose';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import {
  getAmortization,
  getPropertyExpenses,
  getInterests,
} from './financingResultHelpers';

type FinancingResultChartProps = {};

const FinancingResultChart = (props: FinancingResultChartProps) => {
  const interests = getInterests(props);
  const amortization = getAmortization(props);
  const propertyExpenses = getPropertyExpenses(props);

  return (
    <div className="financing-structures-result-chart result">
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
  FinancingDataContainer({ asArrays: true }),
  SingleStructureContainer,
)(FinancingResultChart);
