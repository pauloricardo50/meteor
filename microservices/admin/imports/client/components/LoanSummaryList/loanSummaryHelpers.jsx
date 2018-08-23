import React from 'react';
import moment from 'moment';

import { IntlNumber } from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

export const getLoanSummaryColumns = ({
  status,
  createdAt,
  updatedAt,
  ...loan
}) => {
  const insuranceWithdrawn = Calculator.getInsuranceWithdrawn({ loan });
  const insurancePledged = Calculator.getInsurancePledged({ loan });
  return [
    {
      translationId: 'LoanSummaryColumn.status',
      content: status,
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
      content: (
        <IntlNumber
          value={Calculator.selectPropertyValue({ loan })}
          format="money"
        />
      ),
    },
    {
      translationId: 'general.mortgageLoan',
      content: (
        <IntlNumber
          value={Calculator.selectLoanValue({ loan })}
          format="money"
        />
      ),
    },
    {
      translationId: 'LoanSummaryColumn.fortuneUsed',
      content: (
        <IntlNumber
          value={Calculator.makeSelectStructureKey('fortuneUsed')({ loan })}
          format="money"
        />
      ),
    },
    {
      translationId: 'LoanSummaryColumn.insuranceWithdrawn',
      content: insuranceWithdrawn ? (
        <IntlNumber value={insuranceWithdrawn} format="money" />
      ) : (
        '-'
      ),
    },
    {
      translationId: 'LoanSummaryColumn.insurancePledged',
      content: insurancePledged ? (
        <IntlNumber value={insurancePledged} format="money" />
      ) : (
        '-'
      ),
    },
  ];
};
