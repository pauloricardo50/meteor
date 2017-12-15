import PropTypes from 'prop-types';
import React from 'react';
import Loadable from 'core/utils/loadable';
import { injectIntl } from 'react-intl';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import {
  getLoanValue,
  getProjectValue,
  getPropAndWork,
} from '/imports/js/helpers/requestFunctions';
import constants from '/imports/js/config/constants';
import colors from '/imports/js/config/colors';

import { legendConfig, adjustLegend } from './chartSettings';

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
  const f = props.intl.formatMessage;
  const fN = props.intl.formatNumber;
  const options = {
    chart: {
      type: 'bar',
      style: { fontFamily: 'Source Sans Pro' },
      animation: { duration: 400 },
      height: 220,
      spacingTop: 0,
      spacingBottom: 0,
      marginTop: 0,
      marginBottom: 0,
      // events: {
      //   load() {
      //     adjustLegend(this);
      //   },
      //   redraw() {
      //     adjustLegend(this);
      //   },
      // },
    },
    title: {
      text: f({ id: 'ProjectBarChart.title' }),
      style: { fontSize: '18px', color: '#222', fontWeight: 400 },
      align: props.titleAlign,
    },
    subtitle: {
      text: fN(total, { format: 'money' }),
      style: { fontSize: '14px' },
      align: props.titleAlign,
    },
    tooltip: {
      formatter() {
        const { y, color, series } = this;
        const value = fN(Math.round(y), { format: 'money' });
        const percent = fN(y / total, { format: 'percentage' });

        return `<span style="color:${color}">\u25CF</span> ${
          series.name
        }<br /> <b>${value}</b><br />${percent}`;
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
    legend: legendConfig,
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
      reversedStacks: false,
    },
    // series: [
    //   {
    //     name: 'Emprunt',
    //     data: [['Emprunt', getLoanValue(r)]],
    //   },
    //   {
    //     data: [['2ème Pilier', r.general.insuranceFortuneUsed || 0]],
    //     name: '2ème Pilier',
    //   },
    //   {
    //     data: [
    //       [
    //         'Épargne', // subtract fees from this
    //         r.general.fortuneUsed -
    //           r.property.value * constants.notaryFees -
    //           (r.general.insuranceFortuneUsed * constants.lppFees || 0),
    //       ],
    //     ],
    //     name: 'Épargne',
    //   },
    //   {
    //     data: [['Frais de Notaire', r.property.value * constants.notaryFees]],
    //     name: 'Frais de Notaire',
    //   },
    //   {
    //     data: [['Frais 2ème Pilier', r.general.insuranceFortuneUsed * constants.lppFees || 0]],
    //     name: 'Frais 2ème Pilier',
    //   },
    // ],
    series: [
      {
        name: f({ id: 'ProjectBarChart.property' }),
        data: [getPropAndWork(r)],
        stack: 1,
      },
      {
        name: f({ id: 'ProjectBarChart.fees' }),
        data: [
          r.property.value * constants.notaryFees +
            (r.general.insuranceFortuneUsed * constants.lppFees || 0),
        ],
        stack: 1,
      },
      {
        name: f({ id: 'general.mortgageLoan' }),
        data: [getLoanValue(r)],
        stack: 2,
      },
      {
        name: f({ id: 'general.ownFunds' }),
        data: [total - getLoanValue(r)],
        stack: 2,
      },
    ],
    colors: [
      chartColors.loan,
      chartColors.insuranceFortune,
      chartColors.lppFees,
      chartColors.notaryFees,
      // chartColors.fortune,
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

export default injectIntl(ProjectBarChart);
