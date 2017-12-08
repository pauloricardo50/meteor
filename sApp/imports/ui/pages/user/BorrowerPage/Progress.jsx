import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation';
import { personalInfoPercent, filesPercent } from '/imports/js/arrays/steps';
import { borrowerFiles } from '/imports/js/arrays/files';

const Progress = ({ match, borrower }) => {
  const { tab } = match.params;

  switch (tab) {
    case 'personal': {
      const percent = personalInfoPercent(borrower);
      return (
        <small className={percent >= 1 && 'success'}>
          <T id="general.progress" values={{ value: percent }} />{' '}
          {percent >= 1 && <span className="fa fa-check" />}
        </small>
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
      const percent = filesPercent(borrower, borrowerFiles, 'auction');

      return (
        <small className={percent >= 1 && 'success'}>
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
