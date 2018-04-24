import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';

import PieChart from './PieChart';

const addCenteredTitle = (chart, title) => {
  // Destroy old version of the title
  if (chart.title) {
    chart.title.destroy();
  }

  const { plotLeft, plotTop, plotWidth, plotHeight, renderer } = chart;
  const centerX = plotLeft + plotWidth * 0.5;
  const centerY = plotTop + plotHeight * 0.5;

  // Add title but hide it
  chart.title = renderer
    .text(title, 0, 0)
    .css({ color: '#333333', fontSize: '16px', fontWeight: 400 })
    .hide()
    .add();

  const { width: titleWidth, height: titleHeight } = chart.title.getBBox();
  const shiftedX = centerX - titleWidth / 2;
  // Divide by 4 works better than divide by 2, for some reason
  const shiftedY = centerY + titleHeight / 4;

  // Reposition title and show it
  chart.title.attr({ x: shiftedX, y: shiftedY }).show();
};

const DonutChart = ({ config, title, ...rest }) => (
  <PieChart
    config={merge(config, {
      chart: {
        events: {
          load() {
            addCenteredTitle(this, title);
          },
          redraw() {
            addCenteredTitle(this, title);
          },
        },
      },
      title: { text: '' },
      series: [{ innerSize: '60%' }],
    })}
    {...rest}
  />
);

DonutChart.propTypes = {
  config: PropTypes.object,
  title: PropTypes.string,
};

DonutChart.defaultProps = {
  config: {},
  title: '',
};

export default DonutChart;
