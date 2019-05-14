import moment from 'moment';

import LoanService from '../loans/server/LoanService';

export const newLoansResolver = ({ period = 7 } = {}) => {
  const end1 = moment()
    .subtract(period, 'days')
    .toDate();
  const end2 = moment()
    .subtract(period * 2, 'days')
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

export const loanHistogramResolver = async ({
  resolution = 'day',
  period = 7,
}) => {
  const grouping = {
    year: { $year: '$createdAt' },
    month: { $month: '$createdAt' },
  };

  if (resolution === 'day') {
    grouping.day = { $dayOfMonth: '$createdAt' };
  }

  const aggregation = await LoanService.aggregate([
    {
      $match: {
        createdAt: {
          $gte: moment()
            .subtract(period, 'days')
            .toDate(),
        },
      },
    },
    { $group: { _id: grouping, count: { $sum: 1 } } },
    {
      $project: {
        count: 1,
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day',
          },
        },
      },
    },
    { $sort: { date: 1 } },
  ]).toArray();
  return aggregation;
};
