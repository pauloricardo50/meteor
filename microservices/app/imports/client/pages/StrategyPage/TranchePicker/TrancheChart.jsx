import React from 'react';
import PropTypes from 'prop-types';

import ReactHighcharts from 'react-highcharts';
import { injectIntl } from 'react-intl';

import colors from 'core/config/colors';

const getConfig = ({ tranches, total, intl }) => {
  const f = intl.formatMessage;
  const fN = intl.formatNumber;

  const data = tranches.map(({ type, value }) => ({
    name: f({ id: `offer.${type}` }),
    y: value,
  }));

  const currentSum = tranches.reduce((sum, { value }) => sum + value, 0);
  const showRest = Math.round(currentSum) <= Math.round(total);

  if (showRest) {
    data.push({
      name: f({ id: 'TrancheChart.rest' }),
      y: total - currentSum,
      color: '#eee',
    });
  }

  return {
    chart: {
      type: 'pie',
      style: { fontFamily: 'Eina04-Regular' },
      animation: false,
      height: 250,
      width: 250,
      marginBottom: 56,
    },
    title: {
      text: `<span class="bold">${fN(Math.round(currentSum), {
        format: 'moneyWithoutCurrency',
      })}</span> / ${fN(Math.round(total), {
        format: 'moneyWithoutCurrency',
      })}`,
      style: {
        fontSize: '16px',
        fontWeight: 400,
        color: showRest ? '#222' : colors.error,
      },
      y: -24,
      align: 'center',
      verticalAlign: 'bottom',
    },
    subtitle: {
      text: fN(Math.round(currentSum) / Math.round(total), {
        format: 'percentageRounded',
      }),
      style: {
        fontSize: '14px',
        fontWeight: 400,
        color: '#888',
      },
      y: -8,
      align: 'center',
      verticalAlign: 'bottom',
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
          animation: false,
        },
        showInLegend: false,
      },
    },
    series: [
      {
        type: 'pie',
        name: f({ id: 'TrancheChart.value' }),
        data,
        animation: false,
      },
    ],
    colors: colors.charts,
    lang: { thousandsSep: "'" },
    credits: { enabled: false },
  };
};

const TrancheChart = props => (
  <div id="tranche-chart">
    <ReactHighcharts config={getConfig(props)} />
  </div>
);

TrancheChart.propTypes = {};

export default injectIntl(TrancheChart);
