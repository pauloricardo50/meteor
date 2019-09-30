// @flow
import React from 'react';
import { faChartLine } from '@fortawesome/pro-light-svg-icons/faChartLine';

import BaseChart from 'core/components/charts/BaseChart';
import EmptyChartState from 'core/components/charts/EmptyChartState';
import LoansChartContainer from './LoansChartContainer';

type LoansChartProps = {
  config: Object,
  data: Array,
};

const LoansChart = ({ config, data }: LoansChartProps) => (
  <div className="chart">
    {data.length ? (
      <BaseChart config={config} data={data} />
    ) : (
      <EmptyChartState
        icon={faChartLine}
        text="Invitez des clients pour voir le graphique"
      />
    )}
  </div>
);

export default LoansChartContainer(LoansChart);
