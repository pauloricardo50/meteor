import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Highcharts from 'highcharts';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import {
  getLoanValue,
  getProjectValue,
} from '/imports/js/helpers/requestFunctions';
import constants from '/imports/js/config/constants';
import { getWidth } from '/imports/js/helpers/browserFunctions';

const colors = {
  frais1: '#ABCCF2',
  frais2: '#6888AD',
  fortune: '#5395E0',
  insuranceFortune: '#3A72B2',
  loan: '#287EE0',
};

var timeout;
var oldWidth = getWidth();

export default class ProjectPieChart extends Component {
  constructor(props) {
    super(props);

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
        text: 'Votre Projet',
      },
      subtitle: {
        text: `CHF ${toMoney(getProjectValue(r))}`,
      },
      tooltip: {
        formatter() {
          return `<span style="color:${this.color}">\u25CF</span> ${this.key}<br /> <b>CHF ${toMoney(Math.round(this.y))}</b>`;
        },
      },
      plotOptions: {
        pie: {
          borderWidth: 2,
          allowPointSelect: false,
          cursor: 'pointer',
          dataLabels: {
            enabled: false, // oldWidth >= 768,
            format: '<b>{point.name}</b><br />CHF {point.y:,.0f}',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                'black',
              overflow: 'visible',
            },
          },
          showInLegend: true, // oldWidth < 768,
        },
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        margin: 0,
        padding: 0,
      },
      series: [
        {
          type: 'pie',
          name: 'Votre Projet',
          data: [
            {
              name: 'Emprunt',
              y: getLoanValue(r),
            },
            {
              name: '2ème Pilier',
              y: r.general.insuranceFortuneUsed || 0,
            },
            {
              name: 'Fortune', // subtract fees from this
              y: r.general.fortuneUsed -
                r.property.value * constants.notaryFees -
                (r.general.insuranceFortuneUsed * constants.lppFees || 0),
            },
            {
              name: 'Frais de Notaire',
              y: r.property.value * constants.notaryFees,
            },
            {
              name: 'Frais 2ème Pilier',
              y: r.general.insuranceFortuneUsed * constants.lppFees || 0,
            },
          ],
        },
      ],
      credits: {
        enabled: false,
      },
      lang: {
        thousandsSep: "'",
      },
    };

    Highcharts.setOptions({
      colors: [
        colors.loan,
        colors.insuranceFortune,
        colors.fortune,
        colors.frais1,
        colors.frais2,
      ],
    });

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

    this.chart = new Highcharts.Chart(this.props.divName, options);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    this.chart.destroy();
  }

  resize() {
    // Only recreate charts if the width changes, ignore height changes
    const newWidth = getWidth();

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
    return <div className="pieChart" id={this.props.divName} />;
  }
}

ProjectPieChart.defaultProps = {
  divName: 'projectPieChart',
};

ProjectPieChart.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  divName: PropTypes.string,
};
