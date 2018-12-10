// @flow
import React from 'react';
import merge from 'lodash/merge';

import Chart from './Chart';
import { defaultConfig } from './chartSettings';

const getConfig = ({ lines, title, subtitle, config }) =>
  merge(defaultConfig, {
    title: { text: title },
    subtitle: { text: subtitle },
    series: lines.map(({ data, name }) => ({ data, name })),
    ...config,
  });

type LineChartProps = {};

const LineChart = (props: LineChartProps) => (
  <Chart config={getConfig(props)} data={props.lines} />
);

export default LineChart;
