// @flow
import React from 'react';
import merge from 'lodash/merge';

import BaseChart from './BaseChart';
import { defaultConfig } from './chartSettings';

const getConfig = ({ series, title, subtitle, config }) =>
  merge({}, defaultConfig, {
    title: { text: title },
    subtitle: { text: subtitle },
    series,
    ...config,
  });

type ChartProps = {};

const Chart = ({ series, title, subtitle, config, ...props }: ChartProps) => {
  const finalConfig = getConfig({ series, title, subtitle, config });
  return <BaseChart config={finalConfig} data={series} {...props} />;
};

export default Chart;
