import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { STEP_ORDER, STEPS } from 'core/api/constants';
import ProgressBar from 'core/components/ProgressBar';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';

const DashboardProgressBar = ({ currentStep, variant }) => {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  return (
    <ProgressBar
      className={cx('dashboard-progress-bar', { light: variant === 'light' })}
      steps={STEP_ORDER.map(step => ({
        label: <T id={`Forms.step.${step}`} />,
        tooltip:
          step === STEPS.CLOSING ? (
            <Icon type="monetizationOn" size={40} />
          ) : (
            <T id={`Forms.step.${step}.tooltip`} />
          ),
      }))}
      currentIndex={currentIndex}
    />
  );
};

DashboardProgressBar.propTypes = {
  currentStep: PropTypes.string.isRequired,
};

export default DashboardProgressBar;
