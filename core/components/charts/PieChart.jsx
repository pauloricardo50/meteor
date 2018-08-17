import React from 'react';
import PropTypes from 'prop-types';

import merge from 'lodash/merge';

import { defaultConfig } from './chartSettings';
import chartContainer from './chartContainer';
import Chart from './Chart';

const getConfig = ({ data, title, subtitle, config }) =>
  merge(
    defaultConfig,
    {
      chart: { type: 'pie' },
      title: { text: title },
      subtitle: { text: subtitle },
      plotOptions: {
        pie: {
          size: '100%',
          borderWidth: 0,
          allowPointSelect: false,
          cursor: 'pointer',
          dataLabels: { enabled: false },
          showInLegend: true,
          animation: { duration: 400 },
        },
      },
      series: [
        {
          type: 'pie',
          data: data.map(({ name, value }) => ({ name, y: value })),
        },
      ],
    },
    config,
  );

const PieChart = props => <Chart config={getConfig(props)} data={props.data} />;

PieChart.propTypes = {
  config: PropTypes.object,
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  })),
  intlPrefix: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

PieChart.defaultProps = {
  data: [],
  title: '',
  subtitle: '',
  config: {},
  intlPrefix: undefined,
};

export default chartContainer(PieChart);
