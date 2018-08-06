import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';

const LoanSummaryColumn = ({ translationId, content }) => (
  <div className="flex-col">
    <label>
      <T id={translationId} />
    </label>
    <p>{content}</p>
  </div>
);

LoanSummaryColumn.propTypes = {
  content: PropTypes.node.isRequired,
  translationId: PropTypes.string.isRequired,
};

export default LoanSummaryColumn;
