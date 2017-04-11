import React, { PropTypes } from 'react';

import { getIncomeRatio } from '/imports/js/helpers/finance-math';
import constants from '/imports/js/config/constants';

const getMetrics = props => {
  if (props.metrics.length > 0) {
    return props.metrics;
  }

  const r = props.loanRequest;

  return [
    {
      name: '% de Cash',
      value: r.general.fortuneUsed / r.property.value,
      isValid: r.general.fortuneUsed / r.property.value >= 0.1,
      error: 'Cash doit être au moins 10% de la propriété',
    },
    {
      name: '% de LPP',
      value: (r.general.insuranceFortuneUsed || 0) / r.property.value,
      isValid: (r.general.insuranceFortuneUsed || 0) / r.property.value +
        r.general.fortuneUsed / r.property.value >=
        0.2,
      error: 'Cash et LPP doivent être au moins 20% de la propriété',
    },
    {
      name: "Ratio d'endettement",
      value: getIncomeRatio(r, props.borrowers),
      isValid: getIncomeRatio(r, props.borrowers) <= constants.maxRatio,
      error: 'Doit être moins que 38%',
    },
  ];
};

const MetricsTriple = props => (
  <div className="metrics">
    {getMetrics(props).map((metric, i) => (
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
            {props.percent
              ? Math.round(metric.value * 1000) / 10 + '%'
              : metric.value}
          </h1>
        </div>
      </div>
    ))}
  </div>
);

MetricsTriple.defaultProps = {
  loanRequest: {},
  metrics: [],
  percent: true,
};

MetricsTriple.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
  metrics: PropTypes.arrayOf(PropTypes.any),
  percent: PropTypes.bool,
};

export default MetricsTriple;
