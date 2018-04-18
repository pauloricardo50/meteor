import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';

import PieChart from './PieChart';

const addCenteredTitle = (chart, title) => {
  // Destroy old version of the title
  if (chart.titleNode) {
    chart.titleNode.destroy();
  }

  const centerX = chart.plotLeft + chart.plotWidth * 0.5;
  const centerY = chart.plotTop + chart.plotHeight * 0.5;

  chart.title = chart.renderer
    .text(title, 0, 0)
    .css({ color: '#333333', fontSize: '16px', fontWeight: 400 })
    .hide()
    .add();

  const bbox = chart.title.getBBox();
  const pixelCenteredX = centerX - bbox.width / 2;
  // Divide by 4 works better than divide by 2, for some reason
  const pixelCenteredY = centerY + bbox.height / 4;

  chart.title.attr({ x: pixelCenteredX, y: pixelCenteredY }).show();
};

const DonutChart = ({ config, title, ...rest }) => (
  <PieChart
    config={merge(config, {
      chart: {
        events: {
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
