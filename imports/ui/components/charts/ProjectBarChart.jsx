import PropTypes from 'prop-types';
import React from 'react';
import ReactHighcharts from 'react-highcharts';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import { getLoanValue, getProjectValue } from '/imports/js/helpers/requestFunctions';
import constants from '/imports/js/config/constants';
import colors from '/imports/js/config/colors';

import { legend } from './chartSettings';

const chartColors = {
  notaryFees: colors.charts[4],
  lppFees: colors.charts[3],
  fortune: colors.charts[2],
  insuranceFortune: colors.charts[1],
  loan: colors.charts[0],
};

const getConfig = props => {
  const r = props.loanRequest;
  const total = getProjectValue(r);

  const options = {
    chart: {
      type: 'bar',
      style: { fontFamily: 'Source Sans Pro' },
      animation: { duration: 400 },
      height: 160,
      spacingTop: 0,
      spacingBottom: 0,
    },
    title: {
      text: 'Mon Projet',
      style: { fontSize: '18px', color: '#222', fontWeight: 400 },
      align: props.titleAlign,
    },
    subtitle: {
      text: `CHF ${toMoney(total)}`,
      style: { fontSize: '14px' },
      align: props.titleAlign,
    },
    tooltip: {
      formatter() {
        return `<span style="color:${this.color}">\u25CF</span> ${this.key}<br /> <b>CHF ${toMoney(Math.round(this.y))}</b><br />${Math.round(1000 * this.y / total) / 10}%`;
      },
      style: { fontSize: '14px' },
    },
    plotOptions: {
      bar: {
        borderWidth: 0,
        allowPointSelect: false,
        cursor: 'pointer',
        showInLegend: true,
      },
      series: {
        pointWidth: 40,
        stacking: 'percent',
        animation: true,
      },
    },
    legend,
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
      reversedStacks: false,
      // title: { text: '' },
    },
    series: [
      {
        name: 'Emprunt',
        data: [['Emprunt', getLoanValue(r)]],
      },
      {
        data: [['2ème Pilier', r.general.insuranceFortuneUsed || 0]],
        name: '2ème Pilier',
      },
      {
        data: [
          [
            'Épargne', // subtract fees from this
            r.general.fortuneUsed -
              r.property.value * constants.notaryFees -
              (r.general.insuranceFortuneUsed * constants.lppFees || 0),
          ],
        ],
        name: 'Épargne',
      },
      {
        data: [['Frais de Notaire', r.property.value * constants.notaryFees]],
        name: 'Frais de Notaire',
      },
      {
        data: [['Frais 2ème Pilier', r.general.insuranceFortuneUsed * constants.lppFees || 0]],
        name: 'Frais 2ème Pilier',
      },
    ],
    colors: [
      chartColors.loan,
      chartColors.insuranceFortune,
      chartColors.fortune,
      chartColors.notaryFees,
      chartColors.lppFees,
    ],
    lang: { thousandsSep: "'" },
    credits: { enabled: false },
  };

  return options;
};

const ProjectBarChart = props => <ReactHighcharts config={getConfig(props)} />;

ProjectBarChart.defaultProps = {
  divName: 'projectBarChart',
  titleAlign: 'center',
};

ProjectBarChart.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  divName: PropTypes.string,
  titleAlign: PropTypes.string,
};

export default ProjectBarChart;
