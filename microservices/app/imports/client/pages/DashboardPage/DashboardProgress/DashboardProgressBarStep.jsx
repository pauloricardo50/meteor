import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import T from 'core/components/Translation';

const DashboardProgressBarStep = ({ id, isDone, nb, displayLabel }) => (
  <div key={nb} className="dashboard-progress-bar-step">
    <span className={classnames({ step: true, done: isDone })}>{nb}</span>
    {displayLabel && (
      <span className="step-name">
        <T id={`Forms.step.${id}`} />
      </span>
    )}
  </div>
);

DashboardProgressBarStep.propTypes = {
  displayLabel: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  isDone: PropTypes.bool.isRequired,
  nb: PropTypes.number.isRequired,
};

export default DashboardProgressBarStep;
