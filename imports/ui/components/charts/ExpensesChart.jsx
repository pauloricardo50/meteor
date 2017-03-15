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

    if (this.props.loanRequest) {
      this.state = {
        interests: getInterests(this.props.loanRequest),
        amortization: getAmortization(this.props.loanRequest),
        maintenance: (this.props.loanRequest.property.value * 0.01) / 12,
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

    this.setState({

    });

    if (
      n.interests !== p.interests ||
      n.amortization !== p.amortization ||
      n.maintenance !== p.maintenance ||
      n.loanRequest !== p.loanRequest
    ) {
      const update = () => {
        this.chart.update({
          title: {
            text: `CHF ~${
              toMoney(
                Math.round(
                  this.state.interests + this.state.amortization + this.state.maintenance,
                ),
              )
            }<br>par mois`,
          },
          plotOptions: {
            pie: {
              dataLabels: {
                enabled: this.state.interests && this.state.amortization && this.state.maintenance,
              },
            },
          },
          series: [
            {
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
                  name: 'Charges d\'Entretien',
                  y: this.state.maintenance,
                  color: colors.maintenance,
                },
              ],
            },
          ],
        });
      };


      if (this.props.loanRequest) {
        this.setState({
          interests: getInterests(n.loanRequest),
          amortization: getAmortization(n.loanRequest),
          maintenance: (n.loanRequest.property.value * 0.01) / 12,
        }, () => update());
      } else {
        this.setState({
          interests: n.interests,
          amortization: n.amortizing,
          maintenance: n.maintenance,
        }, () => update());
      }
    }
  }

  createChart() {
    const options = {
      chart: {
        type: 'pie',
      },
      title: {
        text: `CHF ~${
          toMoney(
            Math.round(
              this.state.interests + this.state.amortization + this.state.maintenance,
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
              color: colors.interest,
            }, {
              name: 'Amortissement',
              y: this.state.amortization,
              color: colors.amortization,
            }, {
              name: 'Charges d\'Entretien',
              y: this.state.maintenance,
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
