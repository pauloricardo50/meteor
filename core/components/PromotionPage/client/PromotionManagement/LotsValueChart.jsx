// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie } from '@fortawesome/pro-light-svg-icons/faChartPie';

import BaseChart from 'core/components/charts/BaseChart';
import LotsValueChartContainer from './LotsValueChartContainer';

type LotsValueChartProps = { config: Object, data: Array };

const EmptyState = () => (
  <div className="empty">
    <FontAwesomeIcon icon={faChartPie} className="icon" />
    <h2 className="secondary">Aucune donnée</h2>
    <p>Ajoutez des lots pour voir le graphique</p>
  </div>
);

const LotsValueChart = ({ config, data = [] }: LotsValueChartProps) => (
  <div className="chart">
    {data.length ? <BaseChart config={config} data={data} /> : <EmptyState />}
  </div>
);

export default LotsValueChartContainer(LotsValueChart);
