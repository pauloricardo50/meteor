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
    const p = this.props;

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
          categories: [p.requestName],
        },
      ],
      series: [
        {
          data: [
            [
              p.requestName,
              p.propertyValue * 0.05,
            ],
          ],
          name: 'Frais de Notaire',
          color: colors.frais2,
        }, {
          data: [
            [
              p.requestName,
              p.insuranceFortune * 0.1,
            ],
          ],
          name: 'Retrait 2ème Pilier',
          color: colors.frais1,
        }, {
          data: [
            [
              p.requestName,
              p.fortune,
            ],
          ],
          name: 'Fortune',
          color: colors.fortune,
        }, {
          data: [
            [
              p.requestName,
              p.insuranceFortune,
            ],
          ],
          name: '2ème Pilier',
          color: colors.insuranceFortune,
        }, {
          data: [
            [
              p.requestName,
              p.propertyValue -
              p.fortune -
              p.insuranceFortune,
            ],
          ],
          name: 'Emprunt',
          color: colors.loan,
        },
      ],
      legend: {
        enabled: false,
      },
      loans: {
        enabled: false,
      },
    };

    Highcharts.setOptions({
      lang: {
        thousandsSep: '\'',
      },
    });

    const div = this.props.divName ? this.props.divName : 'projectChart';
    this.chart = new Highcharts.Chart(div, options);
  }

  componentWillUnmount() {
    this.chart.destroy();
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
  requestName: PropTypes.string.isRequired,
  propertyValue: PropTypes.number.isRequired,
  fortune: PropTypes.number.isRequired,
  insuranceFortune: PropTypes.number,
  divName: PropTypes.string,
};
