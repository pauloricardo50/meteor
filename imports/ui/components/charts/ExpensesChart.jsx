import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import ReactHighcharts from 'react-highcharts';

import {
  getInterests,
  getAmortization,
} from '/imports/js/helpers/finance-math';
import { getInterestsWithOffer } from '/imports/js/helpers/requestFunctions';
import colors from '/imports/js/config/colors';

import { legendConfig } from './chartSettings';

const chartColors = {
  interest: colors.charts[0],
  amortization: colors.charts[1],
  maintenance: colors.charts[2],
};

const update = (that) => {
  const { interests, amortization, maintenance } = that.state;
  const total = interests + amortization + maintenance;
  const showLabels = interests && amortization && maintenance;
  const f = that.props.intl.formatMessage;
  const fN = that.props.intl.formatNumber;

  that.chart.getChart().update({
    title: {
      text: `${fN(Math.round(total), { format: 'money' })}<br>par mois*`,
    },
    tooltip: {
      formatter() {
        const { y, color, key } = this;
        const value = fN(Math.round(y), { format: 'money' });
        const percent = fN(y / total, { format: 'percentage' });
        return `<span style="color:${color}">\u25CF</span> ${key}<br /> <b>${value}</b><br />${percent}`;
      },
    },
    series: [
      {
        data: [
          {
            name: f({ id: 'general.interests' }),
            y: interests,
            id: 'interests',
          },
          {
            name: f({ id: 'general.amortization' }),
            y: amortization,
            id: 'amortization',
          },
          {
            name: f({ id: 'general.buildingMaintenance' }),
            y: maintenance,
            id: 'maintenance',
          },
        ],
      },
    ],
    // Add the responsive object again to be able to hide datalabels if the values are updated to 0,
    // which looks horrible on the chart
    responsive: {
      rules: [
        {
          condition: { maxWidth: 768 },
          chartOptions: {
            plotOptions: {
              pie: { dataLabels: { enabled: false }, showInLegend: true },
            },
          },
        },
        {
          condition: { minWidth: 769 },
          chartOptions: {
            plotOptions: {
              pie: {
                dataLabels: {
                  enabled: that.props.showLegend !== false || showLabels,
                },
                showInLegend: that.props.showLegend || false,
              },
            },
          },
        },
      ],
    },
  });
};

class ExpensesChart extends Component {
  constructor(props) {
    super(props);

    if (this.props.loanRequest) {
      let realRate = 0;
      if (
        this.props.loanRequest.logic.lender &&
        this.props.loanRequest.logic.lender.offerId
      ) {
        const offer = this.props.offers.find(
          o => o._id === this.props.loanRequest.logic.lender.offerId,
        );
        if (offer) {
          realRate = getInterestsWithOffer(
            this.props.loanRequest,
            offer,
            false,
          );
        }
      }

      this.state = {
        interests:
          realRate ||
          getInterests(this.props.loanRequest, this.props.interestRate),
        amortization: getAmortization(
          this.props.loanRequest,
          this.props.borrowers,
        ).amortization,
        maintenance: this.props.loanRequest.property.value * 0.01 / 12,
      };
    } else {
      this.state = {
        interests: props.interests,
        amortization: props.amortization,
        maintenance: props.maintenance,
      };
    }
  }

  componentWillReceiveProps(n) {
    const p = this.props;

    if (
      n.interests !== p.interests ||
      n.amortization !== p.amortization ||
      n.maintenance !== p.maintenance ||
      n.loanRequest !== p.loanRequest ||
      n.interestRate !== p.interestRate
    ) {
      if (this.props.loanRequest) {
        this.setState(
          {
            interests: getInterests(n.loanRequest, n.interestRate),
            amortization: getAmortization(n.loanRequest, n.borrowers)
              .amortization,
            maintenance: n.loanRequest.property.value * 0.01 / 12,
          },
          () => update(this),
        );
      } else {
        this.setState(
          {
            interests: n.interests,
            amortization: n.amortization,
            maintenance: n.maintenance,
          },
          () => update(this),
        );
      }
    }
  }

  getConfig = () => {
    const total =
      this.state.interests + this.state.amortization + this.state.maintenance;
    const that = this;
    const f = this.props.intl.formatMessage;
    const fN = this.props.intl.formatNumber;

    const options = {
      chart: {
        type: 'pie',
        style: { fontFamily: 'Source Sans Pro' },
        // animation: { duration: 400 },
        ...(!this.props.title && { spacingTop: 0 }),
        ...(!this.props.title && { marginTop: 0 }),
        events: {
          load() {
            // adjustLegend(this);
            that.addTitle(this);
          },
          redraw() {
            // adjustLegend(this);
            that.addTitle(this);
          },
        },
        spacingBottom: 0,
      },
      tooltip: {
        formatter() {
          const { y, color, key } = this;
          const value = fN(Math.round(y), { format: 'money' });
          const percent = fN(y / total, { format: 'percentage' });

          return `<span style="color:${color}">\u25CF</span> ${key}<br /> <b>${value}</b><br />${percent}`;
        },
        style: { fontSize: '14px' },
      },
      plotOptions: {
        pie: {
          size: '100%',
          borderWidth: 0,
          allowPointSelect: false,
          cursor: 'pointer',
          dataLabels: {
            overflow: 'visible',
            crop: false,
            enabled: true,
            distance: 10,
            format:
              '<span class="bold">{point.name}</span><br />CHF {point.y:,.0f}',
            style: {
              color: '#333',
              fontSize: '14px',
              fontWeight: 400,
              overflow: 'visible',
            },
          },
          showInLegend: false,
        },
      },
      legend: {
        ...legendConfig,
        // reversed: true,
      },
      series: [
        {
          type: 'pie',
          innerSize: '60%',
          colorByPoint: true,
          data: [
            {
              name: f({ id: 'general.interests' }),
              y: this.state.interests,
              id: 'interests',
            },
            {
              name: f({ id: 'general.amortization' }),
              y: this.state.amortization,
              id: 'amortization',
            },
            {
              name: f({ id: 'general.buildingMaintenance' }),
              y: this.state.maintenance,
              id: 'maintenance',
            },
          ],
        },
      ],
      colors: [
        chartColors.interest,
        chartColors.amortization,
        chartColors.maintenance,
      ],
      lang: { thousandsSep: "'" },
      credits: { enabled: false },
      responsive: {
        rules: [
          {
            condition: { maxWidth: 768 },
            chartOptions: {
              plotOptions: {
                pie: { dataLabels: { enabled: false }, showInLegend: true },
              },
            },
          },
          {
            condition: { minWidth: 769 },
            chartOptions: {
              plotOptions: {
                pie: {
                  dataLabels: {
                    enabled: this.props.showLegend !== false || true,
                  },
                  showInLegend: this.props.showLegend || false,
                },
              },
            },
          },
        ],
      },
    };

    return options;
  };

  addTitle = (that) => {
    const total =
      this.state.interests + this.state.amortization + this.state.maintenance;
    const f = this.props.intl.formatMessage;
    const fN = this.props.intl.formatNumber;

    if (that.title) {
      that.title.destroy();
    }

    const r = that.renderer;
    const x = that.series[0].center[0] + that.plotLeft;
    const y = that.series[0].center[1] + that.plotTop;
    const perMonth = f({ id: 'ExpensesChart.perMonth' });
    that.title = r
      .text(
        `${fN(Math.round(total), {
          format: 'money',
        })}<br><span style="font-size: 14px;" class="no-bold">${perMonth}*</span>`,
        0,
        0,
      )
      .css({
        color: '#333333',
        fontSize: '16px',
        fontWeight: 400,
      })
      .hide()
      .add();

    const bbox = that.title.getBBox();
    that.title.attr({ x: x - bbox.width / 2, y }).show();

    if (this.props.title) {
      if (this.secondTitle) {
        this.secondTitle.destroy();
      }

      this.secondTitle = r
        .text(f({ id: this.props.title }), 0, 20)
        .css({
          color: '#222',
          fontSize: '18px',
          fontWeight: 400,
        })
        .add();

      const bbox2 = this.secondTitle.getBBox();

      if (this.props.titleAlign === 'left') {
        this.secondTitle.attr({ x: 10 }); // the default spacing of highchartss
      } else {
        this.secondTitle.attr({ x: x - bbox2.width / 2 });
      }
    }
  };

  render() {
    return (
      <div id="expensesChart">
        <ReactHighcharts
          config={this.getConfig()}
          ref={(c) => {
            this.chart = c;
          }}
          neverReflow
          isPureConfig
        />
      </div>
    );
  }
}

ExpensesChart.defaultProps = {
  loanRequest: undefined,
  interests: 0,
  amortization: 0,
  maintenance: 0,
  interestRate: 0.015,
  showLegend: false,
  title: undefined,
};

ExpensesChart.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
  interests: PropTypes.number,
  amortization: PropTypes.number,
  maintenance: PropTypes.number,
  interestRate: PropTypes.number,
  showLegend: PropTypes.bool,
  title: PropTypes.string,
};

export default injectIntl(ExpensesChart);
