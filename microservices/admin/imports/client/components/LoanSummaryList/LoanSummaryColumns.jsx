import React from 'react';
import PropTypes from 'prop-types';

import LoanSummaryColumn from './LoanSummaryColumn';
import { getLoanSummaryColumns } from './loanSummaryHelpers';

const LoanSummaryColumns = ({
  loan: {
    _id,
    name,
    logic: { step },
    general: { fortuneUsed, insuranceFortuneUsed },
    createdAt,
    updatedAt,
    borrowers,
    property: { value },
  },
}) => (
  <div className="flex admin-loan">
    {getLoanSummaryColumns({
      _id,
      name,
      logic: { step },
      general: { fortuneUsed, insuranceFortuneUsed },
      createdAt,
      updatedAt,
      borrowers,
      property: { value },
    }).map(({ translationId, content }) => (
      <LoanSummaryColumn translationId={translationId} content={content} />
    ))}
  </div>
);

LoanSummaryColumns.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoanSummaryColumns;
