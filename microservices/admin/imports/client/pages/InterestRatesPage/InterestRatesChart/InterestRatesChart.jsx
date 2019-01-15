// @flow
import React from 'react';
import LineChart from 'core/components/charts/LineChart';
import InterestRatesChartContainer from './InterestRatesChartContainer';

const HighchartsExporting = require('highcharts-exporting');

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
