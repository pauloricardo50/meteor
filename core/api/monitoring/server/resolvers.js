import { Meteor } from 'meteor/meteor';

import merge from 'lodash/merge';

import { LOAN_STATUS, LOAN_STATUS_ORDER } from '../../loans/loanConstants';
import LoanService from '../../loans/server/LoanService';
import {
  COMMISSION_STATUS,
  REVENUE_STATUS,
} from '../../revenues/revenueConstants';

const defaultFilters = { status: { $nin: [LOAN_STATUS.TEST] } };

const getPredicate = (filters = {}) => ({
  $match: merge({}, defaultFilters, filters),
});

const getProjection = () => ({
  $project: {
    status: 1,
    revenueLinks: 1,
    selectedStructure: 1,
    createdYear: { $year: { date: '$createdAt' } },
    createdMonth: { $month: { date: '$createdAt' } },
    structure: {
      $arrayElemAt: [
        {
          $filter: {
            input: '$structures',
            as: 'item',
            cond: { $eq: ['$$item.id', '$selectedStructure'] },
          },
        },
        0,
      ],
    },
  },
});

const getRevenues = ({ value, revenueFilters }) => {
  if (value === 'revenues') {
    return [
      {
        $lookup: {
          from: 'revenues',
          localField: 'revenueLinks',
          foreignField: '_id',
          as: 'revenues',
        },
      },
      { $unwind: '$revenues' },
      revenueFilters && { $match: revenueFilters },
      {
        $addFields: {
          revenueDate: {
            $cond: [
              { $eq: ['$revenues.status', REVENUE_STATUS.EXPECTED] },
              '$revenues.expectedAt',
              '$revenues.paidAt',
            ],
          },
          commissionRateToPay: {
            $sum: {
              $map: {
                input: '$revenues.organisationLinks',
                as: 'organisation',
                in: {
                  $cond: [
                    {
                      $eq: [
                        '$$organisation.status',
                        COMMISSION_STATUS.TO_BE_PAID,
                      ],
                    },
                    '$$organisation.commissionRate',
                    0,
                  ],
                },
              },
            },
          },
          commissionRatePaid: {
            $sum: {
              $map: {
                input: '$revenues.organisationLinks',
                as: 'organisation',
                in: {
                  $cond: [
                    { $eq: ['$$organisation.status', COMMISSION_STATUS.PAID] },
                    '$$organisation.commissionRate',
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          revenueYear: { $year: { date: '$revenueDate' } },
          revenueMonth: { $month: { date: '$revenueDate' } },
          'revenues.commissionsToPay': {
            $multiply: ['$commissionRateToPay', '$revenues.amount'],
          },
          'revenues.commissionsPaid': {
            $multiply: ['$commissionRatePaid', '$revenues.amount'],
          },
        },
      },
    ];
  }
};

const getGroupBy = groupBy => {
  switch (groupBy) {
    case 'status':
      return '$status';
    case 'revenueDate':
      return { month: '$revenueMonth', year: '$revenueYear' };
    case 'createdAt':
      return { month: '$createdMonth', year: '$createdYear' };

    default:
      throw new Meteor.Error(`Invalid groupBy: "${groupBy}"`);
  }
};

const getGrouping = ({ groupBy, value }) => {
  const fields = {};
  switch (value) {
    case 'count':
      fields.count = { $sum: 1 };
      break;
    case 'revenues':
      fields.revenues = { $sum: '$revenues.amount' };
      fields.paidRevenues = {
        $sum: {
          $cond: {
            if: { $eq: ['$revenues.status', REVENUE_STATUS.CLOSED] },
            then: '$revenues.amount',
            else: 0,
          },
        },
      };
      fields.expectedRevenues = {
        $sum: {
          $cond: {
            if: { $eq: ['$revenues.status', REVENUE_STATUS.EXPECTED] },
            then: '$revenues.amount',
            else: 0,
          },
        },
      };
      fields.commissionsToPay = { $sum: '$revenues.commissionsToPay' };
      fields.commissionsPaid = { $sum: '$revenues.commissionsPaid' };

      break;
    case 'loanValue':
      fields.loanValue = { $sum: '$structure.wantedLoan' };
      break;
    default:
      throw new Meteor.Error('Invalid grouping value');
  }

  return { $group: { _id: getGroupBy(groupBy), ...fields } };
};

const getSort = ({ groupBy }) => {
  if (groupBy === 'revenueDate' || groupBy === 'createdAt') {
    return { $sort: { '_id.year': 1, '_id.month': 1 } };
  }
};

const buildPipeline = ({ filters, groupBy, value, revenueFilters }) =>
  [
    getPredicate(filters),
    getProjection(),
    getRevenues({ value, revenueFilters }),
    getGrouping({ groupBy, value }),
    getSort({ groupBy }),
  ]
    .reduce((arr, val) => [...arr, ...(Array.isArray(val) ? val : [val])], [])
    .filter(x => x);

export const loanMonitoring = args => {
  const pipeline = buildPipeline(args);
  const result = LoanService.aggregate(pipeline);

  if (args.groupBy === 'status') {
    return result.sort(
      ({ _id: _idA }, { _id: _idB }) =>
        LOAN_STATUS_ORDER.indexOf(_idA) - LOAN_STATUS_ORDER.indexOf(_idB),
    );
  }

  return result;
};
