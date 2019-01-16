// @flow
import React from 'react';
import merge from 'lodash/merge';

import Chart from './Chart';
import { defaultConfig } from './chartSettings';

const getConfig = ({ lines, title, subtitle, config }) =>
  merge({}, defaultConfig, {
    title: { text: title },
    subtitle: { text: subtitle },
    series: lines,
    // lines.map(({ data, name, type, linkedTo, zIndex }) => ({
    //   data,
    //   name,
    //   type,
    //   linkedTo,
    //   zIndex,
    // })),
    ...config,
  });

type LineChartProps = {};

const LineChart = ({
  lines,
  title,
  subtitle,
  config,
  ...props
}: LineChartProps) => (
  <Chart
    config={getConfig({ lines, title, subtitle, config })}
    data={lines}
    {...props}
  />
);

export default LineChart;
