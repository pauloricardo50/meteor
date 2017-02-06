import React, { Component, PropTypes } from 'react';

import Highcharts from 'highcharts';


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

export default class ProjectChart extends Component {
  constructor(props) {
    super(props);

    this.getOptions = this.getOptions.bind(this);
  }

  componentDidMount() {
    const options = this.getOptions(this.props);

    Highcharts.setOptions({
      lang: {
        thousandsSep: '\'',
      },
    });

    this.div = this.props.divName ? this.props.divName : 'projectChart';
    this.chart = new Highcharts.Chart(this.div, options);
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
    this.chart.destroy();
  }


  getOptions(p) {
    return {
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
