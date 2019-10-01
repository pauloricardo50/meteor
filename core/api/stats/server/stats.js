import moment from 'moment';

import { LOAN_STATUS, LOAN_STATUS_ORDER } from 'core/api/loans/loanConstants';
import { sortByStatus } from 'core/utils/sorting';
import LoanService from '../../loans/server/LoanService';

const dateInPast = days =>
  moment()
    .subtract(days, 'days')
    .startOf('day')
    .toDate();

const getFilter = ({ gte, lte, withAnonymous }) => {
  const filter = { createdAt: { $gte: gte } };

  if (lte) {
    filter.createdAt.$lte = lte;
  }

  if (!withAnonymous) {
    filter.anonymous = { $ne: true };
  }

  return filter;
};

export const newLoansResolver = ({ period, withAnonymous } = {}) => {
  const end1 = dateInPast(period);
  const end2 = dateInPast(period * 2);
  const period1 = LoanService.count({
    $filters: getFilter({ gte: end1, withAnonymous }),
  });
  const period2 = LoanService.count({
    $filters: getFilter({ gte: end2, lte: end1, withAnonymous }),
  });

  const change = period2 === 0 ? 1 : (period1 - period2) / period2;

  return { count: period1, change };
};

export const loanHistogramResolver = async ({ period, withAnonymous }) => {
  const match = getFilter({ gte: dateInPast(period), withAnonymous });

  const aggregation = await LoanService.aggregate([
    { $match: match },
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

// Gets all the closing+ loans that have no revenues, they should all have
// some revenues
export const loansWithoutRevenuesResolver = async () => {
  const match = {
    $match: {
      status: {
        $in: [LOAN_STATUS.CLOSING, LOAN_STATUS.BILLING, LOAN_STATUS.FINALIZED],
      },
    },
  };
  const lookupRevenues = {
    $lookup: {
      from: 'revenues',
      localField: 'revenueLinks',
      foreignField: '_id',
      as: 'revenues',
    },
  };
  const filterHasRevenues = { $match: { revenues: { $size: 0 } } };
  const project = { $project: { status: 1, _id: 1, name: 1, userCache: 1 } };
  const sort = { $sort: { status: 1 } };

  const aggregation = await LoanService.aggregate([
    match,
    lookupRevenues,
    filterHasRevenues,
    project,
    sort,
  ]).toArray();

  return aggregation;
};
