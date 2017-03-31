import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Highcharts from 'highcharts';

import {
  getInterests,
  getAmortization,
} from '/imports/js/helpers/finance-math';
import { toMoney } from '/imports/js/helpers/conversionFunctions';
import colors from '/imports/js/config/colors';

const styles = {
  container: {},
};

const chartColors = {
  interest: colors.charts[1],
  amortization: colors.charts[3],
  maintenance: colors.charts[5],
};

var timeout;
var oldWidth;

const update = that => {
  const total = that.state.interests +
    that.state.amortization +
    that.state.maintenance;
  that.chart.update({
    title: {
      text: `CHF ${toMoney(Math.round(total))}<br>par mois*`,
    },
    tooltip: {
      formatter() {
        return `<span style="color:${this.color}">\u25CF</span> ${this.key}<br /> <b>CHF ${toMoney(Math.round(this.y))}</b><br />${Math.round(1000 * this.y / total) / 10}%`;
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: that.state.interests &&
            that.state.amortization &&
            that.state.maintenance,
        },
      },
    },
    series: [
      {
        data: [
          {
            name: 'Intérêts',
            y: that.state.interests,
          },
          {
            name: 'Amortissement',
            y: that.state.amortization,
          },
          {
            name: "Charges d'Entretien",
            y: that.state.maintenance,
          },
        ],
      },
    ],
  });
};

export default class ExpensesChart extends Component {
  constructor(props) {
    super(props);

    if (this.props.loanRequest) {
      this.state = {
        interests: getInterests(this.props.loanRequest),
        amortization: getAmortization(
          this.props.loanRequest,
          this.props.borrowers,
        ),
        maintenance: this.props.loanRequest.property.value * 0.01 / 12,
      };
    } else {
      this.state = {
        interests: props.interests,
        amortization: props.amortizing,
        maintenance: props.maintenance,
      };
    }

    this.createChart = this.createChart.bind(this);
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    this.createChart();
    window.addEventListener('resize', this.resize);
  }

  componentWillReceiveProps(n) {
    const p = this.props;

    this.setState({});

    if (
      n.interests !== p.interests ||
      n.amortization !== p.amortization ||
      n.maintenance !== p.maintenance ||
      n.loanRequest !== p.loanRequest
    ) {
      if (this.props.loanRequest) {
        this.setState(
          {
            interests: getInterests(n.loanRequest),
            amortization: getAmortization(n.loanRequest, n.borrowers),
            maintenance: n.loanRequest.property.value * 0.01 / 12,
          },
          () => update(this),
        );
      } else {
        this.setState(
          {
            interests: n.interests,
            amortization: n.amortizing,
            maintenance: n.maintenance,
          },
          () => update(this),
        );
      }
    }
  }

  createChart() {
    const total = this.state.interests +
      this.state.amortization +
      this.state.maintenance;
    const options = {
      chart: {
        type: 'pie',
      },
      title: {
        text: `CHF ${toMoney(Math.round(total))}<br>par mois*`,
        verticalAlign: 'middle',
        floating: true,
        style: {
          fontSize: '14px',
        },
      },
      tooltip: {
        formatter() {
          return `<span style="color:${this.color}">\u25CF</span> ${this.key}<br /> <b>CHF ${toMoney(Math.round(this.y))}</b><br />${Math.round(1000 * this.y / total) / 10}%`;
        },
      },
      plotOptions: {
        pie: {
          size: '100%',
          borderWidth: 4,
          allowPointSelect: false,
          cursor: 'pointer',
          dataLabels: {
            overflow: 'visible',
            crop: false,
            enabled: true,
            distance: 10,
            format: '<b>{point.name}</b><br />CHF {point.y:,.0f}',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                'black',
              overflow: 'visible',
            },
          },
          showInLegend: true,
        },
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemStyle: {
          width: 90,
        },
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
            },
            {
              name: 'Amortissement',
              y: this.state.amortization,
            },
            {
              name: "Charges d'Entretien",
              y: this.state.maintenance,
            },
          ],
        },
      ],
      colors: [
        chartColors.interest,
        chartColors.amortization,
        chartColors.maintenance,
      ],
      lang: {
        thousandsSep: "'",
        decimalPoint: ',',
      },
      credits: {
        enabled: false,
      },
    };

    Highcharts.getOptions().colors = Highcharts.map(
      Highcharts.getOptions().colors,
      function(color) {
        return {
          radialGradient: {
            cx: 0.5,
            cy: 0.3,
            r: 0.7,
          },
          stops: [
            [0, color],
            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')], // darken
          ],
        };
      },
    );

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
    const newWidth = w.innerWidth ||
      documentElement.clientWidth ||
      body.clientWidth;

    if (oldWidth && oldWidth !== newWidth) {
      Meteor.clearTimeout(timeout);
      if (this.chart) {
        this.chart.destroy();
        this.chart = undefined;
      }

      timeout = Meteor.setTimeout(
        () => {
          Meteor.defer(() => this.createChart());
        },
        200,
      );
    }

    oldWidth = newWidth;
  }

  render() {
    return <div id="expensesChart" style={styles.container} />;
  }
}

ExpensesChart.defaultProps = {
  loanRequest: undefined,
  interests: 0,
  amortizing: 0,
  maintenance: 0,
};

ExpensesChart.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
  interests: PropTypes.number,
  amortizing: PropTypes.number,
  maintenance: PropTypes.number,
};
