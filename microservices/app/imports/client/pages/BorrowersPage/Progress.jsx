import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import T from 'core/components/Translation';
import { filesPercent } from 'core/api/files/fileHelpers';
import BorrowerCalculator from 'core/utils/Calculator/BorrowerCalculator';
import { borrowerDocuments } from 'core/api/files/documents';
import { FILE_STEPS } from 'core/api/constants';

const Progress = ({ tabId, borrower }) => {
  switch (tabId) {
  case 'personal': {
    const percent = BorrowerCalculator.personalInfoPercent({
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
  }
  case 'finance':
    return borrower.logic.hasValidatedFinances ? (
      <small className="success">
        <T id="Finance.validated" /> <span className="fa fa-check" />
      </small>
    ) : (
      <small>
        <T id="Finance.notValidated" />
      </small>
    );
  case 'files': {
    const percent = filesPercent({
      doc: borrower,
      fileArrayFunc: borrowerDocuments,
      step: FILE_STEPS.AUCTION,
    });
    const progressClasses = cx('progress-block', { success: percent >= 1 });

    return (
      <small className={progressClasses}>
        <T id="general.progress" values={{ value: percent }} />{' '}
        {percent >= 1 && <span className="fa fa-check" />}
        <div className="progress-bar">
          <span
            className="progress-bar__wrapper"
            style={{ width: `${percent * 100}%` }}
          />
        </div>
      </small>
    );
  }
  default:
    return null;
  }
};

Progress.propTypes = {
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
  tabId: PropTypes.string.isRequired,
};

export default Progress;
