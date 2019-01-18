// @flow
import React from 'react';
import HighchartsExporting from 'highcharts-exporting';
import HighchartsMore from 'highcharts-more';

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
}: InterestRatesChartProps) => {
  console.log('lines:', lines);
  return (
    <LineChart
      title={title}
      lines={lines}
      config={config}
      HighchartsExporting={HighchartsExporting}
      HighchartsMore={HighchartsMore}
    />
  );
};

export default InterestRatesChartContainer(InterestRatesChart);
