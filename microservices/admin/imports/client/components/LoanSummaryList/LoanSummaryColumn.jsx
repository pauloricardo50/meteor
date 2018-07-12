import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';

const LoanSummaryColumn = ({ translationId, content }) => (
  <div className="flex-col">
    <label htmlFor="">
      <T id={translationId} />
    </label>
    <p>{content}</p>
  </div>
);

LoanSummaryColumn.propTypes = {
  translationId: PropTypes.objectOf(PropTypes.any).isRequired,
  content: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoanSummaryColumn;
