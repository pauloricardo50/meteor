// @flow
import React from 'react';

import BaseChart from 'core/components/charts/BaseChart';
import LoansChartContainer from './LoansChartContainer';

type LoansChartProps = {
  config: Object,
  data: Array,
};

const LoansChart = ({ config, data }: LoansChartProps) => <BaseChart config={config} data={data} />;

export default LoansChartContainer(LoansChart);
