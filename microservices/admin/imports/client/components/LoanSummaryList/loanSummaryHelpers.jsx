import React from 'react';
import moment from 'moment';

import { IntlNumber } from 'core/components/Translation';

export const getLoanSummaryColumns = ({
  logic: { step },
  general: { fortuneUsed, insuranceFortuneUsed },
  createdAt,
  updatedAt,
  structure: { property },
}) => [
  {
    translationId: 'LoanSummaryColumn.etape',
    content: step + 1,
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
    content: <IntlNumber value={property && property.value} format="money" />,
  },
  {
    translationId: 'LoanSummaryColumn.fortuneUsed',
    content: <IntlNumber value={fortuneUsed} format="money" />,
  },
  {
    translationId: 'LoanSummaryColumn.secondThirdPillerUsed',
    content: insuranceFortuneUsed ? (
      <IntlNumber value={insuranceFortuneUsed} format="money" />
    ) : (
      '-'
    ),
  },
];
