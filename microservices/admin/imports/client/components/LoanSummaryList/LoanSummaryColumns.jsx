import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import T, { Money } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import Calculator from 'core/utils/Calculator';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';

const getLoanSummaryColumns = ({ status, createdAt, updatedAt, ...loan }) => {
  const ownFunds = Calculator.getNonPledgedOwnFunds({ loan });
  const ownFundsPledged = Calculator.getTotalPledged({ loan });
  const loanValue = Calculator.selectLoanValue({ loan });
  const propertyValue = Calculator.selectPropertyValue({ loan });
  return [
    {
      translationId: 'LoanSummaryColumn.status',
      content: <StatusLabel status={status} collection={LOANS_COLLECTION} />,
    },
    {
      translationId: 'LoanSummaryColumn.createdAt',
      content: moment(createdAt).format('D MMM YY à HH:mm:ss'),
    },
    {
      translationId: 'LoanSummaryColumn.updatedAt',
      content: updatedAt
        ? moment(updatedAt).format('D MMM YY à HH:mm:ss')
        : '-',
    },
    {
      translationId: 'LoanSummaryColumn.propertyValue',
      content: <Money value={propertyValue} />,
    },
    {
      translationId: 'general.mortgageLoan',
      content: <Money value={loanValue} />,
    },
    {
      translationId: 'LoanSummaryColumn.ownFunds',
      content: <Money value={ownFunds} />,
    },
    {
      translationId: 'LoanSummaryColumn.ownFundsPledged',
      content: <Money value={ownFundsPledged} />,
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
