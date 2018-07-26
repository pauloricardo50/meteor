// @flow
import React from 'react';
import DonutChart from 'core/components/charts/DonutChart';
import { toMoney } from 'core/utils/conversionFunctions';
import SingleStructureContainer from '../containers/SingleStructureContainer';

type FinancingStructuresResultChartProps = {};

const FinancingStructuresResultChart = ({
  getAmortization,
  getInterests,
  ...props
}: FinancingStructuresResultChartProps) => {
  const interests = getInterests(props);
  const amortization = getAmortization(props);
  return (
    <div className="financing-structures-result-chart result">
      <DonutChart
        data={[
          { value: amortization, id: 'amortization' },
          { value: interests, id: 'interests' },
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
            },
          },
          legend: { enabled: false },
        }}
        title=""
      />
      <span className="total">
        <span className="chf">
          {'CHF '}
        </span>
        {toMoney(amortization + interests)}
      </span>
    </div>
  );
};

export default SingleStructureContainer(FinancingStructuresResultChart);
