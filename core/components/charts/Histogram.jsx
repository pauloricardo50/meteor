// @flow
import React from 'react';
import merge from 'lodash/merge';

import Chart from './Chart';
import { defaultConfig } from './chartSettings';

const getConfig = ({ data, title, subtitle, config }) =>
  merge({}, defaultConfig, {
    chart: { type: 'column' },
    title: { text: title },
    subtitle: { text: subtitle },
    xAxis: { type: 'datetime', title: { text: 'Date' } },
    yAxis: { title: { text: 'Nb.' } },
    series: [{ name: 'Histogramme', data }],
    ...config,
  });

type HistogramProps = {};

const Histogram = ({ data, title, subtitle, ...config }: HistogramProps) => (
  <Chart config={getConfig({ data, title, subtitle, config })} data={data} />
);

export default Histogram;
