// @flow
import React from 'react';
import LineChart from 'core/components/charts/LineChart';
import InterestRatesChartContainer from './InterestRatesChartContainer';

type InterestRatesChartProps = {
  title: String,
  xLabels: Array<String>,
  lines: Array<Object>,
};

const InterestRatesChart = ({
  title,
  xLabels,
  lines,
}: InterestRatesChartProps) => <LineChart title={title} xLabels={xLabels} lines={lines} />;

export default InterestRatesChartContainer(InterestRatesChart);
