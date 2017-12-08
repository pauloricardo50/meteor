import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
// import ReactHighstock from 'react-highcharts/ReactHighstock';
// const ReactHighcharts = require('react-highcharts').withHighcharts(ReactHighstock);

import { injectIntl } from 'react-intl';

import {
  getAmortization,
  getInterests,
} from '/imports/js/helpers/finance-math';
import {
  getLoanValue,
  getMaintenance,
  getPropAndWork,
} from '/imports/js/helpers/requestFunctions';
import colors from '/imports/js/config/colors';

const chartColors = {
  debt: colors.charts[0],
  fortune: colors.charts[2],
  payment: colors.charts[1],
  amortization: colors.charts[4],
};

const getData = ({
  loanRequest, borrowers, totalYears, interestRates,
}) => {
  const { amortization, years } = getAmortization(loanRequest, borrowers);
  const maintenance = getMaintenance(loanRequest);
  const loan = getLoanValue(loanRequest);
  const propAndWork = getPropAndWork(loanRequest);

  const debt = [];
  const fortune = [];
  const payment = [];
  const amortizationChart = [];

  for (let i = 0; i <= totalYears; i += 1) {
    let value;
    let amort;
    if (i <= years) {
      value = loan - i * (amortization * 12);
      amort = amortization;
    } else if (i > 0) {
      // make sure we're not trying to access debt[-1]
      value = debt[i - 1];
      amort = 0;
    } else {
      value = loan;
      amort = 0;
    }

    debt[i] = Math.round(value);
    fortune[i] = Math.round(propAndWork - value);
    payment[i] = Math.round(amort + maintenance + getInterests(loanRequest, interestRates[i], value));
    amortizationChart[i] = Math.round(amort);
  }

  return {
    debt, fortune, payment, amortization: amortizationChart,
  };
};

class AmortizationChart extends Component {
  getConfig = () => {
    const f = this.props.intl.formatMessage;
    const {
      debt, fortune, payment, amortization,
    } = getData(this.props);

    return {
      chart: {
        height: 600,
      },
      title: { text: f({ id: 'AmortizationChart.title' }) },
      plotOptions: {
        area: { stacking: 'normal' },
        series: { pointStart: new Date().getFullYear() },
      },
      yAxis: [
        {
          // Primary axis
          title: { text: f({ id: 'AmortizationChart.yAxis1' }) },
        },
        {
          // Secondary axis
          title: {
            text: f({ id: 'AmortizationChart.yAxis2' }),
            style: { color: chartColors.payment },
          },
          opposite: true,
          max: Math.max(...payment) * 1.5,
          min: 0,
        },
      ],
      tooltip: { shared: true },
      series: [
        {
          name: f({ id: 'AmortizationChart.fortuneSeries' }),
          type: 'area',
          data: fortune,
          yAxis: 0,
          color: chartColors.fortune,
        },
        {
          name: f({ id: 'AmortizationChart.debtSeries' }),
          type: 'area',
          data: debt,
          yAxis: 0,
          color: chartColors.debt,
        },
        {
          name: f({ id: 'AmortizationChart.paymentSeries' }),
          type: 'line',
          data: payment,
          yAxis: 1,
          color: chartColors.payment,
        },
        {
          name: f({ id: 'AmortizationChart.amortizationSeries' }),
          type: 'line',
          data: amortization,
          yAxis: 1,
          color: chartColors.amortization,
        },
        // {
        //   name: f({ id: 'AmortizationChart.refinancingFlag' }),
        //   type: 'flags',
        //   y: 0,
        //   data: [{ x: new Date().getFullYear() + 10 }],
        //   shape: 'squarepin',
        // },
      ],
      responsive: {
        rules: [
          {
            condition: { maxWidth: 768 },
            chartOptions: {
              yAxis: [
                { labels: { enabled: false }, title: { text: null } },
                { labels: { enabled: false }, title: { text: null } },
              ],
            },
          },
          {
            condition: { minWidth: 769 },
            chartOptions: {
              yAxis: [
                {
                  labels: { enabled: true },
                  title: { text: f({ id: 'AmortizationChart.yAxis1' }) },
                },
                {
                  labels: { enabled: true },
                  title: { text: f({ id: 'AmortizationChart.yAxis2' }) },
                },
              ],
            },
          },
        ],
      },
      credits: { enabled: false },
    };
  };

  render() {
    return (
      <div id="amortizationChart">
        <ReactHighcharts
          config={this.getConfig()}
          ref={(c) => {
            this.chart = c;
          }}
        />
      </div>
    );
  }
}

AmortizationChart.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalYears: PropTypes.number,
};

AmortizationChart.defaultProps = {
  totalYears: 20,
};

export default injectIntl(AmortizationChart);
