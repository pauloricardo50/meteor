//
import React from 'react';
import { faChartPie } from '@fortawesome/pro-light-svg-icons/faChartPie';

import BaseChart from 'core/components/charts/BaseChart';
import EmptyChartState from 'core/components/charts/EmptyChartState';
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
