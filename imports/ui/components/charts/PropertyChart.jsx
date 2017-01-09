import React, { Component, PropTypes } from 'react';

import Highcharts from 'highcharts';


const styles = {
  container: {
    position: 'relative',
    height: 400,
    width: '100%',
    marginTop: 20,
    marginBottom: 50,
  },
};

const colors = {
  property: '#3498db',
  loan: '#27ae60',
  fortuneTotal: '#2ecc71',
  fortune: '#16a085',
  insuranceFortune: '#1abc9c',
  frais1: '#c0392b',
  frais2: '#e74c3c',
};

export default class PropertyChart extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const r = this.props.loanRequest;

    const options = {
      chart: {
        // 'column' or 'bar'
        type: 'bar',
        style: {
          fontFamily: 'Source Sans Pro, sans-serif',
          fontSize: '16px',
        },
      },
      plotOptions: {
        // column or series
        series: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            style: {
              fontFamily: 'Source Sans Pro, sans-serif',
              fontSize: '14px',
            },
          },
          animation: true,
        },
      },
      title: {
        text: '',
      },
      yAxis: [
        {
          tickInterval: (r.property.value > 2000000 ? 400000 : 200000),
          title: {
            text: 'Montant [CHF]',
          },
          stackLabels: {
            enabled: true,
            style: {
              fontFamily: 'Source Sans Pro, sans-serif',
              fontSize: '14px',
              fontWeight: '400',
            },
          },
        },
      ],
      xAxis: {
        categories: [r.property.address1, 'Propriété', 'Fonds Propres', 'A Payer Cash'],
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: 'Retrait 2ème Pilier',
          data: [[0, (r.general.insuranceFortuneUsed * 0.1)]],
          color: colors.frais2,
        }, {
          name: 'Frais de Notaire',
          data: [[0, (r.property.value * 0.05)]],
          color: colors.frais1,
        }, {
          name: 'Propriété',
          data: [[0, r.property.value]],
          color: colors.property,
        }, {
          name: 'Prêt',
          data: [[1,
            r.property.value -
            r.general.fortuneUsed -
            r.general.insuranceFortuneUsed,
          ]],
          color: colors.loan,
        }, {
          name: 'Fonds Propres',
          data: [[1, r.general.fortuneUsed + r.general.insuranceFortuneUsed]],
          color: colors.fortuneTotal,
        }, {
          name: '2ème Pilier',
          data: [[2, r.general.insuranceFortuneUsed]],
          color: colors.insuranceFortune,
        }, {
          name: 'Fortune',
          data: [[2, r.general.fortuneUsed]],
          color: colors.fortune,
        }, {
          name: 'Retrait 2ème Pilier',
          data: [[3, (r.general.insuranceFortuneUsed * 0.1)]],
          color: colors.frais2,
        }, {
          name: 'Frais de Notaire',
          data: [[3, (r.property.value * 0.05)]],
          color: colors.frais1,
        }, {
          name: 'Fortune',
          data: [[3, r.general.fortuneUsed]],
          color: colors.fortune,
        },
      ],
    };

    Highcharts.setOptions({
      lang: {
        thousandsSep: '\'',
      },
    });
    this.chart = new Highcharts.Chart('propertyChart', options);
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    return (
      <div id="propertyChart" style={styles.container} />
    );
  }
}

PropertyChart.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
};
