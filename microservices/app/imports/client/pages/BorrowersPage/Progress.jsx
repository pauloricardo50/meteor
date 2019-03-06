import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

const Progress = ({ tabId = 'personal', borrower }) => {
  if (tabId !== 'personal') {
    return null;
  }

  const percent = Calculator.personalInfoPercent({
    borrowers: borrower,
  });
  const progressClasses = cx('progress-block', { success: percent >= 1 });

  return (
    <div className={progressClasses}>
      <T id="general.progress" values={{ value: percent }} />{' '}
      {percent >= 1 && <span className="fa fa-check" />}
      <div className="progress-bar">
        <span
          className="progress-bar__wrapper"
          style={{ width: `${percent * 100}%` }}
        />
      </div>
    </div>
  );
};

Progress.propTypes = {
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
  tabId: PropTypes.string.isRequired,
};

export default Progress;
