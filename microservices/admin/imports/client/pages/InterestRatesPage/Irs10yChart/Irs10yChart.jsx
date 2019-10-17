// @flow
import React from 'react';
import HighchartsExporting from 'highcharts-exporting';
import HighchartsMore from 'highcharts-more';

import Chart from 'core/components/charts/Chart';
import Irs10yChartContainer from './Irs10yChartContainer';

type Irs10yChartProps = {
  title: String,
  config: Object,
  lines: Array<Object>,
};

const Irs10yChart = ({ title, lines, config }: Irs10yChartProps) => (
  <Chart
    title={title}
    series={lines}
    config={config}
    highchartsWrappers={{
      HighchartsExporting,
      HighchartsMore,
    }}
  />
);

export default Irs10yChartContainer(Irs10yChart);
