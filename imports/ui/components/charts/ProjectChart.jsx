import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Highcharts from 'highcharts';

import { toMoney } from '/imports/js/conversionFunctions';

const styles = {
  sideNavContainer: {
    position: 'relative',
    height: 'calc(100% - 35px)',
    width: '100%',
  },
  financePageContainer: {
    position: 'relative',
    height: 250,
    width: '100%',
    marginTop: 20,
    marginBottom: 50,
  },
};

const colors = {
  frais1: '#c0392b',
  frais2: '#e74c3c',
  fortune: '#27ae60',
  insuranceFortune: '#2ecc71',
  loan: '#3498db',
};

var timeout;

export default class ProjectChart extends Component {
  constructor(props) {
    super(props);

    this.resize = this.resize.bind(this);
    this.createChart = this.createChart.bind(this);
  }

  componentDidMount() {
    this.createChart(this.props);
    window.addEventListener('resize', this.resize);
  }


  componentWillReceiveProps(n) {
    const p = this.props;
    if (
      n.propertyValue !== p.propertyValue ||
      n.fortuneUsed !== p.fortuneUsed ||
      n.insuranceFortuneUsed !== p.insuranceFortuneUsed
    ) {
      this.chart.series[0].update({
        data: [
          [
            n.name,
            n.propertyValue * 0.05,
          ],
        ],
      });
      this.chart.series[1].update({
        data: [
          [
            n.name,
            n.insuranceFortuneUsed * 0.1,
          ],
        ],
      });
      this.chart.series[2].update({
        data: [
          [
            n.name,
            n.fortuneUsed,
          ],
        ],
      });
      this.chart.series[3].update({
        data: [
          [
            n.name,
            n.insuranceFortuneUsed,
          ],
        ],
      });
      this.chart.series[4].update({
        data: [
          [
            n.name,
            n.propertyValue -
            n.fortuneUsed -
            n.insuranceFortuneUsed,
          ],
        ],
      });

      this.chart.redraw();
    }
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    this.chart.destroy();
  }

  resize() {
    Meteor.clearTimeout(timeout);
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }

    timeout = Meteor.setTimeout(() => {
      Meteor.defer(() => this.createChart(this.props));
    }, 200);
  }


  createChart(p) {
    const options = {
      chart: {
        type: (p.horizontal ? 'bar' : 'column'),
        polar: false,
        width: null,
        height: null,
        zoomType: 'y',
        style: {
          fontFamily: 'Source Sans Pro, sans-serif',
          fontSize: '16px',
        },
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '1em',
            },
            formatter() {
              if (this.y !== 0) {
                return `CHF ${toMoney(this.y)}`;
              }
              return null;
            },
          },
          animation: true,
        },
      },
      title: {
        text: (p.horizontal ? '' : 'Mon Projet'),
      },
      yAxis: [
        {
          tickInterval: (p.propertyValue > 2000000 ? 200000 : 100000),
          title: {
            text: 'Montant [CHF]',
          },
        },
      ],
      xAxis: [
        {
          categories: [p.name],
          labels: {
            enabled: false,
          },
        },
      ],
      series: [
        {
          data: [
            [
              p.name,
              p.propertyValue * 0.05,
            ],
          ],
          name: 'Frais de Notaire',
          color: colors.frais2,
        }, {
          data: [
            [
              p.name,
              p.insuranceFortuneUsed * 0.1,
            ],
          ],
          name: 'Retrait 2ème Pilier',
          color: colors.frais1,
        }, {
          data: [
            [
              p.name,
              p.fortuneUsed,
            ],
          ],
          name: 'Fortune',
          color: colors.fortune,
        }, {
          data: [
            [
              p.name,
              p.insuranceFortuneUsed,
            ],
          ],
          name: '2ème Pilier',
          color: colors.insuranceFortune,
        }, {
          data: [
            [
              p.name,
              p.propertyValue -
              p.fortuneUsed -
              p.insuranceFortuneUsed,
            ],
          ],
          name: 'Emprunt',
          color: colors.loan,
        },
      ],
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
    };

    Highcharts.setOptions({
      lang: {
        thousandsSep: '\'',
      },
    });

    this.div = this.props.divName ? this.props.divName : 'projectChart';
    this.chart = new Highcharts.Chart(this.div, options);
  }


  render() {
    return (<div
      id={this.props.divName ? this.props.divName : 'projectChart'}
      style={(this.props.horizontal ? styles.financePageContainer : styles.sideNavContainer)}
    />);
  }
}

ProjectChart.propTypes = {
  horizontal: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  propertyValue: PropTypes.number.isRequired,
  fortuneUsed: PropTypes.number.isRequired,
  insuranceFortuneUsed: PropTypes.number,
  divName: PropTypes.string,
};
