import { Meteor } from 'meteor/meteor';

import merge from 'lodash/merge';

import { REVENUE_STATUS, LOAN_STATUS } from 'core/api/constants';
import { ACTIVITY_EVENT_METADATA } from 'core/api/activities/activityConstants';
import { LOAN_STATUS_ORDER } from 'core/api/loans/loanConstants';
import { COMMISSION_STATUS } from 'core/api/revenues/revenueConstants';
import ActivityService from '../../activities/server/ActivityService';
import LoanService from '../../loans/server/LoanService';

const defaultFilters = {
  status: { $nin: [LOAN_STATUS.TEST] },
};

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

const getRevenues = ({ value }) => {
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

const buildPipeline = ({ filters, groupBy, value }) =>
  [
    getPredicate(filters),
    getProjection(),
    getRevenues({ value }),
    getGrouping({ groupBy, value }),
    getSort({ groupBy }),
  ]
    .reduce((arr, val) => [...arr, ...(Array.isArray(val) ? val : [val])], [])
    .filter(x => x);

export const loanMonitoring = args => {
  const pipeline = buildPipeline(args);
  return LoanService.aggregate(pipeline);
};

const getFilters = ({ fromDate, toDate }) => {
  const filters = {
    'metadata.event': ACTIVITY_EVENT_METADATA.LOAN_CHANGE_STATUS,
  };

  if (fromDate) {
    filters.createdAt = {};
    filters.createdAt.$gte = fromDate;
  }

  if (toDate) {
    filters.createdAt = filters.createdAt || {};
    filters.createdAt.$lte = toDate;
  }

  return filters;
};

const getLoanFilters = ({ loanCreatedAtFrom, loanCreatedAtTo }) => {
  const filters = {};

  if (!loanCreatedAtFrom && !loanCreatedAtTo) {
    return {};
  }

  if (loanCreatedAtFrom) {
    filters['loan.createdAt'] = {};
    filters['loan.createdAt'].$gte = loanCreatedAtFrom;
  }

  if (loanCreatedAtTo) {
    filters['loan.createdAt'] = filters['loan.createdAt'] || {};
    filters['loan.createdAt'].$lte = loanCreatedAtTo;
  }

  return filters;
};

const assigneeBreakdown = filters => [
  {
    $match: getFilters(filters),
  },
  {
    $lookup: {
      from: 'loans',
      localField: 'loanLink._id',
      foreignField: '_id',
      as: 'loan',
    },
  },
  {
    $project: {
      _id: 1,
      metadata: 1,
      'loan._id': 1,
      'loan.name': 1,
      'loan.userCache': 1,
      'loan.createdAt': 1,
    },
  },
  { $addFields: { loan: { $arrayElemAt: ['$loan', 0] } } },
  { $match: getLoanFilters(filters) },
  {
    $group: {
      _id: {
        assignedEmployeeId: '$loan.userCache.assignedEmployeeCache._id',
        prevStatus: '$metadata.details.prevStatus',
        nextStatus: '$metadata.details.nextStatus',
      },
      activities: { $push: '$$ROOT' },
      count: { $sum: 1 },
    },
  },
  {
    $group: {
      _id: '$_id.assignedEmployeeId',
      statusChanges: {
        $push: {
          prevStatus: '$_id.prevStatus',
          nextStatus: '$_id.nextStatus',
          count: '$count',
        },
      },
      totalStatusChangeCount: { $sum: '$count' },
      loanIds: { $push: '$activities.loan._id' },
    },
  },
  // Simple array flattening, as these ids arrive in the form of an array of arrays
  {
    $addFields: {
      loanIds: {
        $reduce: {
          input: '$loanIds',
          initialValue: [],
          in: { $concatArrays: ['$$value', '$$this'] },
        },
      },
    },
  },
  // Add this stage for consistency
  { $sort: { '_id.assignedEmployeeId': 1 } },
];

const loanStatusChangePipeline = filters => [
  { $match: getFilters(filters) },
  {
    $group: {
      _id: {
        prevStatus: '$metadata.details.prevStatus',
        nextStatus: '$metadata.details.nextStatus',
      },
      count: { $sum: 1 },
      loanIds: { $push: '$loanLink._id' },
    },
  },
];

export const loanStatusChanges = args => {
  const { breakdown, ...filters } = args;

  let pipeline = [];

  if (breakdown === 'assignee') {
    pipeline = assigneeBreakdown(filters);
  } else if (breakdown) {
    throw new Meteor.Error('breakdown property can only be "assignee"');
  } else {
    pipeline = loanStatusChangePipeline(filters);
  }

  const results = ActivityService.aggregate(pipeline);

  if (breakdown === 'assignee') {
    return results.map(({ statusChanges, ...data }) => ({
      ...data,
      statusChanges: statusChanges.sort(
        ({ prevStatus: prevStatusA }, { prevStatus: prevStatusB }) =>
          LOAN_STATUS_ORDER.indexOf(prevStatusA) -
          LOAN_STATUS_ORDER.indexOf(prevStatusB),
      ),
    }));
  }

  return results.sort(
    ({ _id: _idA }, { _id: _idB }) =>
      LOAN_STATUS_ORDER.indexOf(_idA.prevStatus) -
      LOAN_STATUS_ORDER.indexOf(_idB.prevStatus),
  );
};
