// @flow
import React from 'react';
import LineChart from 'core/components/charts/LineChart';
import Irs10yChartContainer from './Irs10yChartContainer';

const HighchartsExporting = require('highcharts-exporting');
const HighchartsMore = require('highcharts-more');

type Irs10yChartProps = {
  title: String,
  config: Object,
  lines: Array<Object>,
};

const Irs10yChart = ({ title, lines, config }: Irs10yChartProps) => (
  <LineChart
    title={title}
    lines={lines}
    config={config}
    HighchartsExporting={HighchartsExporting}
    HighchartsMore={HighchartsMore}
  />
);

export default Irs10yChartContainer(Irs10yChart);
