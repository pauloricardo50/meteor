import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import T from 'core/components/Translation';
import { personalInfoPercent, filesPercent } from 'core/arrays/steps';
import { borrowerDocuments } from 'core/api/files/documents';
import { FILE_STEPS } from 'core/api/constants';

const Progress = ({ match, borrower }) => {
  const { tab } = match.params;

  switch (tab) {
  case 'personal': {
    const percent = personalInfoPercent(borrower);
    const progressClasses = classNames('progress-block', {
      success: percent >= 1,
    });

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

    return (
      <small className={percent >= 1 ? 'success' : undefined}>
        <T id="general.progress" values={{ value: percent }} />{' '}
        {percent >= 1 && <span className="fa fa-check" />}
      </small>
    );
  }
  default:
    return null;
  }
};

Progress.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Progress;
