import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';

import T from 'core/components/Translation';
import Icon from 'core/components/Icon';
import { STEPS } from 'core/api/constants';

const DashboardProgressBarStep = ({ id, isDone, nb, displayLabel }) => (
  <Tooltip
    title={
      id === STEPS.CLOSING ? (
        <Icon type="monetizationOn" className="heart-beat" size={40} />
      ) : (
        <T id={`Forms.step.${id}.tooltip`} />
      )
    }
  >
    <div key={nb} className="dashboard-progress-bar-step">
      <span className={classnames({ step: true, done: isDone })}>{nb}</span>
      {displayLabel && (
        <span className="step-name">
          <T id={`Forms.step.${id}`} />
        </span>
      )}
    </div>
  </Tooltip>
);

DashboardProgressBarStep.propTypes = {
  displayLabel: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  isDone: PropTypes.bool.isRequired,
  nb: PropTypes.number.isRequired,
};

export default DashboardProgressBarStep;
