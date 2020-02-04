//      
import React from 'react';
import HighchartsExporting from 'highcharts-exporting';
import HighchartsMore from 'highcharts-more';
import HighchartsExportData from 'highcharts-export-data';

import Chart from 'core/components/charts/Chart';
import Toggle from 'core/components/Toggle';
import InterestRatesChartContainer from './InterestRatesChartContainer';

                                
                
                 
                       
                         
                      
  

const InterestRatesChart = ({
  title,
  lines,
  config,
  toggleRanges,
  showRanges,
}                         ) => (
  <>
    <Toggle
      onToggle={toggleRanges}
      toggled={showRanges}
      labelRight="Afficher les étendues"
    />
    <Chart
      title={title}
      series={lines}
      config={config}
      highchartsWrappers={{
        HighchartsExporting,
        HighchartsMore,
        HighchartsExportData,
      }}
    />
  </>
);

export default InterestRatesChartContainer(InterestRatesChart);
