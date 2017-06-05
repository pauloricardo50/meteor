import PropTypes from 'prop-types';
import React from 'react';

import { getIncomeRatio } from '/imports/js/helpers/finance-math';
import constants from '/imports/js/config/constants';
import AutoTooltip from './AutoTooltip.jsx';

const MetricsTriple = props =>
  <div className="metrics">
    {props.metrics.map(
      (metric, i) =>
        !metric.hide &&
        <div className="metric" key={i}>
          <div>
            <h4 className="secondary">
              <AutoTooltip placement="top">{metric.name}</AutoTooltip>
              {' '}
              {metric.isValid !== undefined &&
                (metric.isValid
                  ? <span className="fa fa-check success" />
                  : <span className="fa fa-times error" />)}
            </h4>

            {!metric.isValid && <p className="error">{metric.error}</p>}

            <h1>
              {props.percent ? `${Math.round(metric.value * 1000) / 10}%` : metric.value}
            </h1>
          </div>
        </div>,
    )}
  </div>;

MetricsTriple.defaultProps = {
  percent: true,
};

MetricsTriple.propTypes = {
  metrics: PropTypes.arrayOf(PropTypes.any).isRequired,
  percent: PropTypes.bool,
};

export default MetricsTriple;
