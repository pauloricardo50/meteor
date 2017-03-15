import React, { Component, PropTypes } from 'react';

import { getRatio } from '/imports/js/finance-math';
import constants from '/imports/js/constants';

export default class StrategyCashMetrics extends React.Component {
  constructor(props) {
    super(props);

    this.getMetrics = this.getMetrics.bind(this);
  }

  getMetrics() {
    if (this.props.metrics) {
      return this.props.metrics;
    }

    const r = this.props.loanRequest;

    return [
      {
        name: '% de Cash',
        value: r.general.fortuneUsed / r.property.value,
        isValid: r.general.fortuneUsed / r.property.value >= 0.1,
        error: 'Cash doit être au moins 10% de la propriété',
      },
      {
        name: '% de LPP',
        value: r.general.insuranceFortuneUsed / r.property.value,
        isValid: r.general.insuranceFortuneUsed / r.property.value +
          r.general.fortuneUsed / r.property.value >=
          0.2,
        error: 'Cash et LPP doivent être au moins 20% de la propriété',
      },
      {
        name: "Ratio d'endettement",
        value: getRatio(r),
        isValid: getRatio(r) <= constants.maxRatio,
        error: 'Doit être mois que 35%',
      },
    ];
  }

  render() {
    return (
      <div className="metrics">
        {this.getMetrics().map((metric, i) => (
          <div className="metric" key={i}>
            <div>
              <h4 className="secondary">
                <span>{metric.name}</span>
                &nbsp;
                {metric.isValid !== undefined &&
                  (metric.isValid
                    ? <span className="fa fa-check success" />
                    : <span className="fa fa-times error" />)}
              </h4>

              {!metric.isValid && <p className="error">{metric.error}</p>}

              <h1>
                {this.props.percent
                  ? Math.round(metric.value * 1000) / 10 + '%'
                  : metric.value}
              </h1>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

StrategyCashMetrics.defaultProps = {
  percent: true,
};

StrategyCashMetrics.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
  metrics: PropTypes.arrayOf(PropTypes.any),
  percent: PropTypes.bool,
};
