//      
import React from 'react';
import HighchartsExporting from 'highcharts-exporting';
import HighchartsMore from 'highcharts-more';

import Chart from 'core/components/charts/Chart';
import Irs10yChartContainer from './Irs10yChartContainer';

                         
                
                 
                       
  

const Irs10yChart = ({ title, lines, config }                  ) => (
  <Chart
    title={title}
    series={lines}
    config={config}
    highchartsWrappers={{
      HighchartsExporting,
      HighchartsMore,
    }}
  />
);

export default Irs10yChartContainer(Irs10yChart);
