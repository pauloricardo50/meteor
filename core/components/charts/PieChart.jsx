import React from 'react';
import PropTypes from 'prop-types';

import merge from 'lodash/merge';

import { defaultConfig } from './chartSettings';
import chartContainer from './chartContainer';
import Chart from './Chart';

const getConfig = ({ data, title, subtitle, config }) =>
  merge(defaultConfig, config, {
    chart: { type: 'pie' },
    title: { text: title },
    subtitle: { text: subtitle },
    plotOptions: {
      pie: {
        borderWidth: 0,
        allowPointSelect: false,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
          format: '<b>{point.name}</b><br />CHF {point.y:,.0f}',
          style: { overflow: 'visible' },
        },
        showInLegend: true,
      },
      series: { animation: true },
    },
    series: [
      {
        type: 'pie',
        name: title,
        data: data.map(({ name, value }) => ({ name, y: value })),
      },
    ],
  });

const PieChart = props => <Chart config={getConfig(props)} data={props.data} />;

PieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  })),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  intlPrefix: PropTypes.string.isRequired,
  config: PropTypes.object,
};

PieChart.defaultProps = {
  data: [],
  title: '',
  subtitle: '',
  config: {},
};

export default chartContainer(PieChart);
