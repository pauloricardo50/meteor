import React, { Component, PropTypes } from 'react';

import Highcharts from 'highcharts';

import { getYearsToRetirement } from '/imports/js/finance-math.js';
import { toMoney } from '/imports/js/conversionFunctions'

const styles = {
  container: {
    position: 'relative',
    height: 400,
    width: '100%',
  },
};

const colors = {
  interest: '#2c3e50',
  amortization: '#f39c12',
  maintenance: '#3498db',
};

export default class ExpensesChart extends Component {
  constructor(props) {
    super(props);

    this.getAmortization = this.getAmortization.bind(this);
    this.getInterests = this.getInterests.bind(this);
  }

  componentDidMount() {
    const r = this.props.loanRequest;

    const options = {
      chart: {
        type: 'pie',
      },
      title: {
        text: `CHF ${
          toMoney(
            Math.round(
              this.getInterests() + this.getAmortization() + ((r.property.value * 0.01) / 12)
            )
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
        pointFormat: 'Montant: <b>CHF {point.y:,.0f}</b>',
      },
      plotOptions: {
        pie: {
          size: '100%',
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: CHF {point.y:,.0f}',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
            },
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
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
    this.chart.destroy();
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
    return <div id="expensesChart" style={styles.container} />;
  }
}

ExpensesChart.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
};
