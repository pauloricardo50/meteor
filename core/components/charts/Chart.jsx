import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactHighcharts from 'react-highcharts';

export default class Chart extends Component {
  componentWillReceiveProps({ data: nextData }) {
    const { data: prevData } = this.props;
    // If previous data[i].value is different from next data, update chart
    if (
      nextData.some((dataPoint, index) => dataPoint.value !== prevData[index].value)
    ) {
      this.update(nextData);
    }
  }

  update = (data) => {
    if (this.chart) {
      // FIXME: This should animate the chart somehow
      this.chart.getChart().series[0].setData(data);
    }
  };

  render() {
    const { config } = this.props;
    return (
      <ReactHighcharts
        config={config}
        ref={(c) => {
          this.chart = c;
        }}
      />
    );
  }
}

Chart.propTypes = {
  config: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};
