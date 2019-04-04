// @flow
import React from 'react';
import HighchartsExporting from 'highcharts-exporting';
import HighchartsMore from 'highcharts-more';
import HighchartsExportData from 'highcharts-export-data';

import LineChart from 'core/components/charts/LineChart';
import Toggle from 'core/components/Toggle';
import InterestRatesChartContainer from './InterestRatesChartContainer';

type InterestRatesChartProps = {
  title: String,
  config: Object,
  lines: Array<Object>,
  toggleRanges: Function,
  showRanges: boolean,
};

const InterestRatesChart = ({
  title,
  lines,
  config,
  toggleRanges,
  showRanges,
}: InterestRatesChartProps) => (
  <>
    <Toggle
      onToggle={toggleRanges}
      toggled={showRanges}
      labelRight="Afficher les étendues"
    />
    <LineChart
      title={title}
      lines={lines}
      config={config}
      HighchartsExporting={HighchartsExporting}
      HighchartsMore={HighchartsMore}
      HighchartsExportData={HighchartsExportData}
    />
  </>
);

export default InterestRatesChartContainer(InterestRatesChart);
