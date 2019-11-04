import { Meteor } from 'meteor/meteor';

import merge from 'lodash/merge';

import { REVENUE_STATUS, LOAN_STATUS } from 'core/api/constants';
import { ACTIVITY_EVENT_METADATA } from 'core/api/activities/activityConstants';
import { LOAN_STATUS_ORDER } from 'core/api/loans/loanConstants';
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
            $cond: {
              if: { $eq: ['$revenues.status', REVENUE_STATUS.EXPECTED] },
              then: '$revenues.expectedAt',
              else: '$revenues.paidAt',
            },
          },
        },
      },
      {
        $addFields: {
          revenueYear: { $year: { date: '$revenueDate' } },
          revenueMonth: { $month: { date: '$revenueDate' } },
        },
      },
    ];
  }
};

const getGroupBy = (groupBy) => {
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

export const loanMonitoring = async (args) => {
  const pipeline = buildPipeline(args);
  const agg = await LoanService.aggregate(pipeline).toArray();
  return agg;
};

export const loanStatusChanges = async (args) => {
  const { fromDate, toDate } = args;

  if (!fromDate || !toDate) {
    return [];
  }

  const pipeline = [
    {
      $match: {
        'metadata.event': ACTIVITY_EVENT_METADATA.LOAN_CHANGE_STATUS,
        createdAt: { $gte: fromDate, $lte: toDate },
      },
    },
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
  const agg = await ActivityService.aggregate(pipeline).toArray();
  const sortedResults = agg.sort(({ _id: _idA }, { _id: _idB }) => {
    if (_idA.prevStatus !== _idB.prevStatus) {
      return (
        LOAN_STATUS_ORDER.indexOf(_idA.prevStatus)
        - LOAN_STATUS_ORDER.indexOf(_idB.prevStatus)
      );
    }

    // If the 2 statuses are the same
    const statusIndex = LOAN_STATUS_ORDER.indexOf(_idA.prevStatus);
    const secondSort = [
      ...LOAN_STATUS_ORDER.splice(statusIndex),
      ...LOAN_STATUS_ORDER.slice(0, statusIndex),
    ];

    return (
      secondSort.indexOf(_idA.nextStatus) - secondSort.indexOf(_idB.nextStatus)
    );
  });

  return sortedResults;
};
