import React from 'react';
import { faChartPie } from '@fortawesome/pro-light-svg-icons/faChartPie';

import BaseChart from '../../../charts/BaseChart';
import EmptyChartState from '../../../charts/EmptyChartState';
import LotsChartContainer from './LotsChartContainer';

const LotsChart = ({ config, data = [] }) => (
  <div className="chart">
    {data.length ? (
      <BaseChart config={config} data={data} />
    ) : (
      <EmptyChartState
        icon={faChartPie}
        text="Ajoutez des lots pour voir le graphique"
      />
    )}
  </div>
);

export default LotsChartContainer(LotsChart);
