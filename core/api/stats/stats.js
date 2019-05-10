import moment from 'moment';

import LoanService from '../loans/server/LoanService';

export const newLoansResolver = ({ period = 7 } = {}) => {
  const end1 = moment()
    .subtract('days', period)
    .toDate();
  const end2 = moment()
    .subtract('days', period * 2)
    .toDate();
  const period1 = LoanService.count({
    $filters: { createdAt: { $gte: end1 } },
  });
  const period2 = LoanService.count({
    $filters: { createdAt: { $gte: end2, $lte: end1 } },
  });

  const change = period2 === 0 ? 1 : (period1 - period2) / period2;

  return { count: period1, change };
};
