import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Highcharts from 'highcharts';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import {
  getLoanValue,
  getProjectValue,
} from '/imports/js/helpers/requestFunctions';
import constants from '/imports/js/config/constants';
import { getWidth } from '/imports/js/helpers/browserFunctions';
import colors from '/imports/js/config/colors';

const chartColors = {
  frais1: colors.charts[0],
  frais2: colors.charts[1],
  fortune: colors.charts[2],
  insuranceFortune: colors.charts[3],
  loan: colors.charts[5],
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
    const total = getProjectValue(r);

    const options = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Mon Projet',
      },
      subtitle: {
        text: `CHF ${toMoney(total)}`,
      },
      tooltip: {
        formatter() {
          return `<span style="color:${this.color}">\u25CF</span> ${this.key}<br /> <b>CHF ${toMoney(Math.round(this.y))}</b><br />${Math.round(1000 * this.y / total) / 10}%`;
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
          name: 'Mon Projet',
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
      colors: [
        chartColors.loan,
        chartColors.insuranceFortune,
        chartColors.fortune,
        chartColors.frais1,
        chartColors.frais2,
      ],
      lang: {
        thousandsSep: "'",
      },
      credits: {
        enabled: false,
      },
    };

    Highcharts.setOptions({});

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
