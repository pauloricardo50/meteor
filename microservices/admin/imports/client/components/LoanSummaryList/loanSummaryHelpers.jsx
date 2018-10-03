import React from 'react';
import moment from 'moment';

import T, { Money } from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

export const getLoanSummaryColumns = ({
  status,
  createdAt,
  updatedAt,
  ...loan
}) => {
  const ownFunds = Calculator.getNonPledgedOwnFunds({ loan });
  const ownFundsPledged = Calculator.getTotalPledged({ loan });
  const loanValue = Calculator.selectLoanValue({ loan });
  const propertyValue = Calculator.selectPropertyValue({ loan });
  return [
    {
      translationId: 'LoanSummaryColumn.status',
      content: <T id={`Forms.status.${status}`} />,
    },
    {
      translationId: 'LoanSummaryColumn.createdAt',
      content: moment(createdAt).format('D MMM YY à HH:mm:ss'),
    },
    {
      translationId: 'LoanSummaryColumn.updatedAt',
      content: moment(updatedAt).format('D MMM YY à HH:mm:ss'),
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
