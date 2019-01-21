// @flow
import React from 'react';
import HighchartsExporting from 'highcharts-exporting';
import HighchartsMore from 'highcharts-more';

import LineChart from 'core/components/charts/LineChart';
import Button from 'core/components/Button';
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
}: InterestRatesChartProps) => {
  return (
    <>
      <Button onClick={toggleRanges} primary>
        {showRanges ? 'Masquer les étendues' : 'Afficher les étendues'}
      </Button>
      <LineChart
        title={title}
        lines={lines}
        config={config}
        HighchartsExporting={HighchartsExporting}
        HighchartsMore={HighchartsMore}
      />
    </>
  );
};

export default InterestRatesChartContainer(InterestRatesChart);
