import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Highcharts from 'highcharts';

import { getYearsToRetirement } from '/imports/js/finance-math.js';
import { toMoney } from '/imports/js/conversionFunctions'

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

    this.getAmortization = this.getAmortization.bind(this);
    this.getInterests = this.getInterests.bind(this);
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
              this.getInterests() + this.getAmortization() + ((r.property.value * 0.01) / 12),
            ),
          )
        }<br>par mois`,
        align: 'center',
        verticalAlign: 'middle',
        y: 60,
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
          allowPointSelect: true,
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
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
        },
      },
      legend: {
        align: 'center',
        verticalAlign: 'top',
        floating: true,
        layout: 'horizontal',
        itemMarginBottom: 8,
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
              y: this.getInterests(),
              color: colors.interest,
            }, {
              name: 'Amortissement',
              y: this.getAmortization(),
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

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }


  getAmortization() {
    const r = this.props.loanRequest;
    const loan = r.property.value -
      r.general.fortuneUsed -
      r.general.insuranceFortuneUsed;
    const yearsToRetirement = getYearsToRetirement(
      Number(r.borrowers[0].age),
      r.borrowers[1] && r.borrowers[1].age ? Number(r.borrowers[1].age) : 0,
      r.borrowers[0].gender,
      r.borrowers[1] && r.borrowers[1].gender,
    );
    const loanPercent = loan / r.property.value;

    let yearlyAmortization = 0;
    if (loanPercent > 0.65) {
      // The loan has to be below 65% before 15 years or before retirement, whichever comes first
      const remainingYears = Math.min(yearsToRetirement, 15);
      const amountToAmortize = (loanPercent - 0.65) * r.property.value;

      // Make sure we don't create a black hole, or use negative values by error
      if (remainingYears > 0) {
        // Amortization is the amount to amortize divided by the amount of years before the deadline
        yearlyAmortization = amountToAmortize / remainingYears;
      }
    }

    return yearlyAmortization / 12;
  }

  getInterests() {
    const r = this.props.loanRequest;
    const loan = r.property.value -
      r.general.fortuneUsed -
      r.general.insuranceFortuneUsed;


    if (r.logic.hasChosenStrategy) {
      // TODO: return real interest rate
    }

    return (loan * 0.015) / 12;
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
