import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Random } from 'meteor/random';

import ReactHighcharts from 'react-highcharts';

export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.id = Random.id();
    const { HighchartsExporting, HighchartsMore } = this.props;
    if (HighchartsExporting) {
      HighchartsExporting(ReactHighcharts.Highcharts);
    }
    if (HighchartsMore) {
      HighchartsMore(ReactHighcharts.Highcharts);
    }
  }

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
    if (this[this.id]) {
      // FIXME: This should animate the chart somehow
      this[this.id].getChart().series[0].setData(data);
      this[this.id].getChart().update({});
    }
  };

  componentWillUnmount() {
    this[this.id] = null;
  }

  render() {
    const { config } = this.props;

    return (
      <ReactHighcharts
        config={config}
        ref={(c) => {
          this[this.id] = c;
          // this[this.id] = c;
        }}
      />
    );
  }
}

Chart.propTypes = {
  config: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};
