// @flow
import React from 'react';
import merge from 'lodash/merge';

import BaseChart from './BaseChart';
import { defaultConfig } from './chartSettings';

const getConfig = ({ data, name, title, subtitle, config }) =>
  merge({}, defaultConfig, {
    chart: { type: 'column' },
    title: { text: title },
    subtitle: { text: subtitle },
    xAxis: { type: 'datetime', title: { text: 'Date' } },
    yAxis: { title: { text: 'Nb.' } },
    series: [{ name, data }],
    ...config,
  });

type HistogramProps = {};

const Histogram = ({
  data,
  title,
  subtitle,
  name,
  ...config
}: HistogramProps) => (
  <BaseChart
    config={getConfig({ data, title, subtitle, name, config })}
    data={data}
  />
);

export default Histogram;
