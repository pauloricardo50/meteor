import React from 'react';
import { faChartLine } from '@fortawesome/pro-light-svg-icons/faChartLine';

import BaseChart from '../../../charts/BaseChart';
import EmptyChartState from '../../../charts/EmptyChartState';
import LoansChartContainer from './LoansChartContainer';

const LoansChart = ({ config, data }) => (
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
