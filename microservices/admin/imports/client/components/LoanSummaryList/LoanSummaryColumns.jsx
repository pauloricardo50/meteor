import React from 'react';
import PropTypes from 'prop-types';

import LoanSummaryColumn from './LoanSummaryColumn';
import { getLoanSummaryColumns } from './loanSummaryHelpers';

const LoanSummaryColumns = ({ loan }) => (
  <div className="flex admin-loan">
    {getLoanSummaryColumns(loan).map(({ translationId, content }) => (
      <LoanSummaryColumn translationId={translationId} content={content} key={translationId} />
    ))}
  </div>
);

LoanSummaryColumns.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoanSummaryColumns;
