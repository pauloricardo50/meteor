import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import T from 'core/components/Translation';

const DashboardProgressBarStep = ({ id, isDone, nb }) => (
  <div key={nb} className="dashboard-progress-bar-step">
    <span className={classnames({ step: true, done: isDone })}>{nb}</span>
    <T id={`steps.${id}`} />
  </div>
);

DashboardProgressBarStep.propTypes = {
  id: PropTypes.string.isRequired,
  isDone: PropTypes.bool.isRequired,
  nb: PropTypes.number.isRequired,
};

export default DashboardProgressBarStep;
