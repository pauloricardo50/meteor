import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import Icon from 'core/components/Icon';
import T, { IntlNumber } from 'core/components/Translation';

export const getLoanSummaryColumns = ({
  _id,
  name,
  logic: { step },
  general: { fortuneUsed, insuranceFortuneUsed },
  createdAt,
  updatedAt,
  borrowers,
  property: { value },
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
    content: <IntlNumber value={value} format="money" />,
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
