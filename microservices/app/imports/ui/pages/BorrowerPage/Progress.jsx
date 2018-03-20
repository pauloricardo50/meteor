import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import { personalInfoPercent, filesPercent } from 'core/arrays/steps';
import { borrowerDocuments } from 'core/api/files/documents';

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
    const percent = filesPercent(borrower, borrowerDocuments, 'auction');

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
