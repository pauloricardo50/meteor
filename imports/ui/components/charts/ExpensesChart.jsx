import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Highcharts from 'highcharts';

import { getInterests, getAmortization } from '/imports/js/finance-math';
import { toMoney } from '/imports/js/conversionFunctions';

const styles = {
  container: {

  },
};

const colors = {
  interest: '#56E39F',
  amortization: '#59C9A5',
  maintenance: '#5B6C5D',
};

var timeout;
var oldWidth;

export default class ExpensesChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      interests: getInterests(this.props.loanRequest),
      amortization: getAmortization(this.props.loanRequest),
    };

    this.createChart = this.createChart.bind(this);
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    this.createChart();
    window.addEventListener('resize', this.resize);
  }

  createChart() {
    const r = this.props.loanRequest;

    const options = {
      chart: {
        type: 'pie',
      },
      title: {
        text: `CHF ~${
          toMoney(
            Math.round(
              this.state.interests + this.state.amortization + ((r.property.value * 0.01) / 12),
            ),
          )
        }<br>par mois`,
        verticalAlign: 'middle',
        floating: true,
        style: {
          fontSize: '14px',
        },
      },
      tooltip: {
        formatter() {
          return `<span style="color:${this.color}">\u25CF</span> ${this.key}<br /> <b>CHF ${toMoney(Math.round(this.y))}</b>`;
        },
      },
      plotOptions: {
        pie: {
          size: '100%',
          borderWidth: 4,
          allowPointSelect: false,
          cursor: 'pointer',
          dataLabels: {
            overflow: 'none',
            crop: false,
            enabled: true,
            format: '<b>{point.name}</b><br />CHF {point.y:,.0f}',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
              overflow: 'visible',
            },
          },
          showInLegend: true,
        },
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        // floating: true,
        layout: 'horizontal',
        // itemMarginBottom: 8,
      },
      series: [
        {
          type: 'pie',
          innerSize: '50%',
          name: 'Dépenses Mensuelles Estimées',
          colorByPoint: true,
          data: [
            {
              name: 'Intérêts',
              y: this.state.interests,
              color: colors.interest,
            }, {
              name: 'Amortissement',
              y: this.state.amortization,
              color: colors.amortization,
            }, {
              name: 'Entretien',
              y: (r.property.value * 0.01) / 12,
              color: colors.maintenance,
            },
          ],
        },
      ],
      credits: {
        enabled: false,
      },
    };

    Highcharts.setOptions({
      lang: {
        thousandsSep: '\'',
      },
    });

    this.chart = new Highcharts.Chart('expensesChart', options);
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    this.chart.destroy();
  }

  resize() {
    // Only recreate charts if the width changes, ignore height changes
    const w = window;
    const d = document;
    const documentElement = d.documentElement;
    const body = d.getElementsByTagName('body')[0];
    const newWidth = w.innerWidth || documentElement.clientWidth || body.clientWidth;

    if (oldWidth && oldWidth !== newWidth) {
      Meteor.clearTimeout(timeout);
      if (this.chart) {
        this.chart.destroy();
        this.chart = undefined;
      }

      timeout = Meteor.setTimeout(() => {
        Meteor.defer(() => this.createChart());
      }, 200);
    }

    oldWidth = newWidth;
  }


  render() {
    return (
      <div id="expensesChart" style={styles.container} />
    );
  }
}

ExpensesChart.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
};
