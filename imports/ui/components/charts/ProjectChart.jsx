import React, { Component, PropTypes } from 'react';

import Highcharts from 'highcharts';
import RaisedButton from 'material-ui/RaisedButton';


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
  }

  componentDidMount() {
    const r = this.props.creditRequest;

    const options = {
      chart: {
        type: (this.props.horizontal ? 'bar' : 'column'),
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
        text: (this.props.horizontal ? '' : 'Mon Projet'),
      },
      yAxis: [
        {
          tickInterval: (r.propertyInfo.value > 2000000 ? 200000 : 100000),
          title: {
            text: 'Montant [CHF]',
          },
        },
      ],
      xAxis: [
        {
          categories: [r.requestName],
        },
      ],
      series: [
        {
          data: [
            [
              r.requestName,
              r.propertyInfo.value * 0.05,
            ],
          ],
          name: 'Frais de Notaire',
          color: colors.frais2,
        }, {
          data: [
            [
              r.requestName,
              r.financialInfo.insuranceFortune * 0.1,
            ],
          ],
          name: 'Retrait 2ème Pilier',
          color: colors.frais1,
        }, {
          data: [
            [
              r.requestName,
              r.financialInfo.fortune,
            ],
          ],
          name: 'Fortune',
          color: colors.fortune,
        }, {
          data: [
            [
              r.requestName,
              r.financialInfo.insuranceFortune,
            ],
          ],
          name: '2ème Pilier',
          color: colors.insuranceFortune,
        }, {
          data: [
            [
              r.requestName,
              r.propertyInfo.value -
              r.financialInfo.fortune -
              r.financialInfo.insuranceFortune,
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
    this.chart = new Highcharts.Chart('projectChart', options);
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    return (<div
      id="projectChart"
      style={(this.props.horizontal ? styles.financePageContainer : styles.sideNavContainer)}
    />);
  }
}

ProjectChart.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any),
  horizontal: PropTypes.bool.isRequired,
};
