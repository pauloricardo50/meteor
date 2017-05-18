import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';

import { getInterests, getAmortization } from '/imports/js/helpers/finance-math';
import { toMoney } from '/imports/js/helpers/conversionFunctions';
import colors from '/imports/js/config/colors';

import { legend } from './chartSettings';

const chartColors = {
  interest: colors.charts[0],
  amortization: colors.charts[1],
  maintenance: colors.charts[2],
};

const update = that => {
  const total = that.state.interests + that.state.amortization + that.state.maintenance;
  const showLabels = that.state.interests && that.state.amortization && that.state.maintenance;
  that.chart.getChart().update({
    title: {
      text: `CHF ${toMoney(Math.round(total))}<br>par mois*`,
    },
    tooltip: {
      formatter() {
        return `<span style="color:${this.color}">\u25CF</span> ${this.key}<br /> <b>CHF ${toMoney(Math.round(this.y))}</b><br />${Math.round(1000 * this.y / total) / 10}%`;
      },
    },
    series: [
      {
        data: [
          {
            name: 'Intérêts',
            y: that.state.interests,
            id: 'interests',
          },
          {
            name: 'Amortissement',
            y: that.state.amortization,
            id: 'amortization',
          },
          {
            name: "Frais d'Entretien",
            y: that.state.maintenance,
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
                dataLabels: { enabled: that.props.showLegend !== false || showLabels },
                showInLegend: that.props.showLegend || false,
              },
            },
          },
        },
      ],
    },
  });
};

export default class ExpensesChart extends Component {
  constructor(props) {
    super(props);

    if (this.props.loanRequest) {
      this.state = {
        interests: getInterests(this.props.loanRequest),
        amortization: getAmortization(this.props.loanRequest, this.props.borrowers),
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

    this.setState({});

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
            interests: getInterests(n.loanRequest),
            amortization: getAmortization(n.loanRequest, n.borrowers),
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
    const total = this.state.interests + this.state.amortization + this.state.maintenance;
    const that = this;
    const options = {
      chart: {
        type: 'pie',
        style: { fontFamily: 'Source Sans Pro' },
        animation: { duration: 400 },
        ...(!this.props.title && { spacingTop: 0 }),
        ...(!this.props.title && { marginTop: 0 }),
        events: {
          load() {
            that.addTitle(this);
          },
          redraw() {
            that.addTitle(this);
          },
        },
        spacingBottom: 0,
      },
      tooltip: {
        formatter() {
          return `<span style="color:${this.color}">\u25CF</span> ${this.key}<br /> <b>CHF ${toMoney(Math.round(this.y))}</b><br />${Math.round(1000 * this.y / total) / 10}%`;
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
            format: '<span class="bold">{point.name}</span><br />CHF {point.y:,.0f}',
            style: {
              color: '#333',
              fontSize: '14px',
              fontWeight: 300,
              overflow: 'visible',
            },
          },
          showInLegend: false,
        },
      },
      legend,
      series: [
        {
          type: 'pie',
          innerSize: '50%',
          name: 'Dépenses Mensuelles Estimées',
          colorByPoint: true,
          data: [
            { name: 'Intérêts', y: this.state.interests, id: 'interests' },
            { name: 'Amortissement', y: this.state.amortization, id: 'amortization' },
            { name: "Frais d'Entretien", y: this.state.maintenance, id: 'maintenance' },
          ],
        },
      ],
      colors: [chartColors.interest, chartColors.amortization, chartColors.maintenance],
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
                  dataLabels: { enabled: this.props.showLegend !== false || true },
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

  addTitle = that => {
    const total = this.state.interests + this.state.amortization + this.state.maintenance;

    if (that.title) {
      that.title.destroy();
    }

    const r = that.renderer;
    const x = that.series[0].center[0] + that.plotLeft;
    const y = that.series[0].center[1] + that.plotTop;
    that.title = r
      .text(
        `CHF ${toMoney(Math.round(total))}<br><span style="font-size: 14px;" class="no-bold">par mois*</span>`,
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
        .text(this.props.title, 0, 20)
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
          ref={c => {
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
