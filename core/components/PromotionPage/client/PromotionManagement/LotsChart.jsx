// @flow
import React from 'react';

import BaseChart from 'core/components/charts/BaseChart';
import LotsChartContainer from './LotsChartContainer';

type LotsChartProps = {
  config: Object,
  data: Array,
};

const LotsChart = ({ config, data }: LotsChartProps) => (
  <BaseChart config={config} data={data} />
);

export default LotsChartContainer(LotsChart);
