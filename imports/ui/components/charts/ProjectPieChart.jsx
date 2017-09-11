import PropTypes from 'prop-types';
import React from 'react';
import Loadable from '/imports/js/helpers/loadable';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import {
  getLoanValue,
  getProjectValue,
} from '/imports/js/helpers/requestFunctions';
import constants from '/imports/js/config/constants';
import colors from '/imports/js/config/colors';

import { legend } from './chartSettings';

const ReactHighcharts = Loadable({
  loader: () => import('react-highcharts'),
});

const chartColors = {
  notaryFees: colors.charts[4],
  lppFees: colors.charts[3],
  fortune: colors.charts[2],
  insuranceFortune: colors.charts[1],
  loan: colors.charts[0],
};

const getConfig = (props) => {
  const r = props.loanRequest;
  const total = getProjectValue(r);

  const options = {
    chart: {
      type: 'pie',
      style: { fontFamily: 'Source Sans Pro' },
      animation: { duration: 400 },
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
        return `<span style="color:${this.color}">\u25CF</span> ${this
          .key}<br /> <b>CHF ${toMoney(
          Math.round(this.y),
        )}</b><br />${Math.round(1000 * this.y / total) / 10}%`;
      },
      style: { fontSize: '14px' },
    },
    plotOptions: {
      pie: {
        borderWidth: 0,
        allowPointSelect: false,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
          format: '<b>{point.name}</b><br />CHF {point.y:,.0f}',
          style: {
            overflow: 'visible',
          },
        },
        showInLegend: true,
      },
    },
    legend,
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
            y:
              r.general.fortuneUsed -
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
      chartColors.notaryFees,
      chartColors.lppFees,
    ],
    lang: { thousandsSep: "'" },
    credits: { enabled: false },
  };

  return options;
};

const ProjectPieChart = props => <ReactHighcharts config={getConfig(props)} />;

ProjectPieChart.defaultProps = {
  divName: 'projectPieChart',
  titleAlign: 'center',
};

ProjectPieChart.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  divName: PropTypes.string,
  titleAlign: PropTypes.string,
};

export default ProjectPieChart;
