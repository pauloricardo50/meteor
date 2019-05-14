import moment from 'moment';

import LoanService from '../loans/server/LoanService';

const dateInPast = days =>
  moment()
    .subtract(days, 'days')
    .startOf('day')
    .toDate();

export const newLoansResolver = ({ period = 7 } = {}) => {
  const end1 = dateInPast(period);
  const end2 = dateInPast(period * 2);
  const period1 = LoanService.count({
    $filters: { createdAt: { $gte: end1 } },
  });
  const period2 = LoanService.count({
    $filters: { createdAt: { $gte: end2, $lte: end1 } },
  });

  const change = period2 === 0 ? 1 : (period1 - period2) / period2;

  return { count: period1, change };
};

export const loanHistogramResolver = async ({ period = 7 }) => {
  const aggregation = await LoanService.aggregate([
    { $match: { createdAt: { $gte: dateInPast(period) } } },
    {
      $project: {
        // Filter out time of day
        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      },
    },
    { $group: { _id: '$date', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]).toArray();
  return aggregation;
};
