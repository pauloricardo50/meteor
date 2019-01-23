// @flow
import React from 'react';
import HighchartsExporting from 'highcharts-exporting';

import LineChart from 'core/components/charts/LineChart';
import InterestRatesChartContainer from './InterestRatesChartContainer';

type InterestRatesChartProps = {
  title: String,
  config: Object,
  lines: Array<Object>,
};

const InterestRatesChart = ({
  title,
  lines,
  config,
}: InterestRatesChartProps) => (
  <LineChart
    title={title}
    lines={lines}
    config={config}
    HighchartsExporting={HighchartsExporting}
  />
);

export default InterestRatesChartContainer(InterestRatesChart);
