import moment from 'moment';

import { LOAN_STATUS } from '../../loans/loanConstants';
import LoanService from '../../loans/server/LoanService';
import UserService from '../../users/server/UserService';

const dateInPast = days =>
  moment()
    .subtract(days, 'days')
    .startOf('day')
    .toDate();

const getFilter = ({ gte, lte }) => {
  const filter = { createdAt: { $gte: gte } };

  if (lte) {
    filter.createdAt.$lte = lte;
  }

  return filter;
};

const makeCountResolver = service => ({ period, filters } = {}) => {
  const end1 = dateInPast(period);
  const end2 = dateInPast(period * 2);
  const period1 = service.count({
    $filters: { ...getFilter({ gte: end1 }), ...filters },
  });
  const period2 = service.count({
    $filters: { ...getFilter({ gte: end2, lte: end1 }), ...filters },
  });

  const change = period2 === 0 ? 1 : (period1 - period2) / period2;

  return { count: period1, change };
};

const makeHistogramResolver = service => ({ period, filters }) => {
  const match = { ...getFilter({ gte: dateInPast(period) }), ...filters };

  const aggregation = service.aggregate([
    { $match: match },
    {
      $project: {
        // Filter out time of day
        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      },
    },
    { $group: { _id: '$date', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  return aggregation;
};

export const newLoansResolver = ({ period, withAnonymous } = {}) => {
  const resolver = makeCountResolver(LoanService);
  return resolver({
    period,
    filters: withAnonymous ? {} : { anonymous: { $ne: true } },
  });
};

export const loanHistogramResolver = async ({ period, withAnonymous }) => {
  const resolver = makeHistogramResolver(LoanService);
  return resolver({
    period,
    filters: withAnonymous ? {} : { anonymous: { $ne: true } },
  });
};

export const newUsersResolver = ({ period, verified, roles } = {}) => {
  const resolver = makeCountResolver(UserService);
  return resolver({
    period,
    filters: { roles, ...(verified ? { 'emails.0.verified': true } : {}) },
  });
};

export const userHistogramResolver = async ({ period, verified, roles }) => {
  const resolver = makeHistogramResolver(UserService);
  return resolver({
    period,
    filters: { roles, ...(verified ? { 'emails.0.verified': true } : {}) },
  });
};

// Gets all the closing+ loans that have no revenues, they should all have
// some revenues
export const loansWithoutRevenuesResolver = () => {
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
  const project = {
    $project: { status: 1, _id: 1, name: 1, userCache: 1 },
  };
  const sort = { $sort: { status: 1 } };

  return LoanService.aggregate([
    match,
    lookupRevenues,
    filterHasRevenues,
    project,
    sort,
    { $addFields: { _collection: 'loans' } },
  ]);
};
