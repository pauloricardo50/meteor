// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/pro-light-svg-icons/faChartLine';

import BaseChart from 'core/components/charts/BaseChart';
import LoansChartContainer from './LoansChartContainer';

type LoansChartProps = {
  config: Object,
  data: Array,
};

const EmptyState = () => (
  <div className="empty">
    <FontAwesomeIcon icon={faChartLine} className="icon" />
    <h2 className="secondary">Aucune donnée</h2>
    <p>Invitez des clients pour voir le graphique</p>
  </div>
);

const LoansChart = ({ config, data }: LoansChartProps) => (
  <div className="chart">
    {data.length ? <BaseChart config={config} data={data} /> : <EmptyState />}
  </div>
);

export default LoansChartContainer(LoansChart);
