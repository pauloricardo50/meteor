import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import StatusLabel from 'core/components/StatusLabel';
import T, { Money } from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

const getLoanSummaryColumns = ({
  _collection,
  status,
  createdAt,
  updatedAt,
  ...loan
}) => {
  const loanValue = Calculator.selectLoanValue({ loan });
  const propertyValue = Calculator.selectPropertyValue({ loan });
  return [
    {
      translationId: 'LoanSummaryColumn.status',
      content: <StatusLabel status={status} collection={_collection} />,
    },
    {
      translationId: 'LoanSummaryColumn.createdAt',
      content: moment(createdAt).format('D MMM YY à HH:mm:ss'),
    },
    {
      translationId: 'LoanSummaryColumn.propertyValue',
      content: <Money value={propertyValue} />,
    },
    {
      translationId: 'general.mortgageLoan',
      content: <Money value={loanValue} />,
    },
  ];
};

const LoanSummaryColumns = ({ loan }) => (
  <div className="flex admin-loan">
    {getLoanSummaryColumns(loan).map(({ translationId, content }) => (
      <div className="flex-col" key={translationId}>
        <label>
          <T id={translationId} />
        </label>
        <p>{content}</p>
      </div>
    ))}
  </div>
);

LoanSummaryColumns.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoanSummaryColumns;
