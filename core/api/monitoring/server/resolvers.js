import { Meteor } from 'meteor/meteor';

import merge from 'lodash/merge';

import { ACTIVITY_EVENT_METADATA } from '../../activities/activityConstants';
import ActivityService from '../../activities/server/ActivityService';
import {
  INSURANCE_REQUESTS_COLLECTION,
  INSURANCE_REQUEST_STATUS,
  INSURANCE_REQUEST_STATUS_ORDER,
} from '../../insuranceRequests/insuranceRequestConstants';
import {
  INSURANCES_COLLECTION,
  INSURANCE_STATUS,
} from '../../insurances/insuranceConstants';
import {
  LOANS_COLLECTION,
  LOAN_STATUS,
  LOAN_STATUS_ORDER,
} from '../../loans/loanConstants';
import LoanService from '../../loans/server/LoanService';
import {
  COMMISSION_STATUS,
  REVENUE_STATUS,
} from '../../revenues/revenueConstants';

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

const getFilters = ({ fromDate, toDate }) => {
  const filters = {
    'metadata.event': ACTIVITY_EVENT_METADATA.LOAN_CHANGE_STATUS,
    'metadata.details.nextStatus': { $ne: LOAN_STATUS.TEST },
  };

  if (fromDate) {
    filters.createdAt = { $gte: fromDate };
  }

  if (toDate) {
    filters.createdAt = filters.createdAt || {};
    filters.createdAt.$lte = toDate;
  }

  return filters;
};

const COLLECTION_INITIAL_FILTERS = {
  [LOANS_COLLECTION]: {
    'metadata.event': ACTIVITY_EVENT_METADATA.LOAN_CHANGE_STATUS,
    'metadata.details.nextStatus': { $ne: LOAN_STATUS.TEST },
  },
  [INSURANCE_REQUESTS_COLLECTION]: {
    'metadata.event': ACTIVITY_EVENT_METADATA.INSURANCE_REQUEST_CHANGE_STATUS,
    'metadata.details.nextStatus': { $ne: INSURANCE_REQUEST_STATUS.TEST },
  },
  [INSURANCES_COLLECTION]: {
    'metadata.event': ACTIVITY_EVENT_METADATA.INSURANCE_CHANGE_STATUS,
  },
};

const getCollectionFilters = ({ collection, fromDate, toDate }) => {
  const filters = COLLECTION_INITIAL_FILTERS[collection];

  if (fromDate) {
    filters.createdAt = { $gte: fromDate };
  }

  if (toDate) {
    filters.createdAt = filters.createdAt || {};
    filters.createdAt.$lte = toDate;
  }

  return filters;
};

const getLoanFilters = ({ loanCreatedAtFrom, loanCreatedAtTo }) => {
  const filters = {
    'loan.status': { $ne: LOAN_STATUS.TEST },
  };

  if (!loanCreatedAtFrom && !loanCreatedAtTo) {
    return filters;
  }

  if (loanCreatedAtFrom) {
    filters['loan.createdAt'] = { $gte: loanCreatedAtFrom };
  }

  if (loanCreatedAtTo) {
    filters['loan.createdAt'] = filters['loan.createdAt'] || {};
    filters['loan.createdAt'].$lte = loanCreatedAtTo;
  }

  return filters;
};

const getCollectionCreatedAtFilters = ({
  singularCollection,
  createdAtFrom,
  createdAtTo,
}) => {
  const filters = {
    [`${singularCollection}.status`]: { $ne: INSURANCE_REQUEST_STATUS.TEST },
  };

  if (!createdAtFrom && !createdAtTo) {
    return filters;
  }

  if (createdAtFrom) {
    filters[`${singularCollection}.createdAt`] = {
      $gte: createdAtFrom,
    };
  }

  if (createdAtTo) {
    filters[`${singularCollection}.createdAt`] =
      filters[`${singularCollection}.createdAt`] || {};
    filters[`${singularCollection}.createdAt`].$lte = createdAtTo;
  }

  return filters;
};

const assigneeBreakdown = filters => [
  { $match: getFilters(filters) },
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
      'loan.assigneeLinks': 1,
      'loan.createdAt': 1,
      'loan.status': 1,
    },
  },
  { $addFields: { loan: { $arrayElemAt: ['$loan', 0] } } },
  { $addFields: { loan: { _collection: 'loans' } } },
  { $match: getLoanFilters(filters) },

  {
    $group: {
      _id: {
        // Extract the main assignee
        assigneeId: {
          $reduce: {
            input: '$loan.assigneeLinks',
            initialValue: '',
            in: {
              $cond: {
                if: { $eq: ['$$this.isMain', true] },
                then: '$$this._id',
                else: '',
              },
            },
          },
        },
        prevStatus: '$metadata.details.prevStatus',
        nextStatus: '$metadata.details.nextStatus',
      },
      activities: { $push: '$$ROOT' },
      count: { $sum: 1 },
    },
  },
  {
    $group: {
      _id: '$_id.assigneeId',
      statusChanges: {
        $push: {
          prevStatus: '$_id.prevStatus',
          nextStatus: '$_id.nextStatus',
          count: '$count',
        },
      },
      totalStatusChangeCount: { $sum: '$count' },
      loans: { $push: '$activities.loan' },
    },
  },
  // Simple array flattening, as these ids arrive in the form of an array of arrays
  {
    $addFields: {
      loans: {
        $reduce: {
          input: '$loans',
          initialValue: [],
          in: { $concatArrays: ['$$value', '$$this'] },
        },
      },
    },
  },
  // Add this stage for consistency
  { $sort: { '_id.assigneeId': 1 } },
];

const getCollectionFragment = ({ collection, singularCollection }) => {
  if (collection === INSURANCES_COLLECTION) {
    return {
      [`${singularCollection}._id`]: 1,
      [`${singularCollection}.name`]: 1,
      [`${singularCollection}.insuranceRequestCache`]: 1,
      [`${singularCollection}.createdAt`]: 1,
      [`${singularCollection}.status`]: 1,
    };
  }

  return {
    [`${singularCollection}._id`]: 1,
    [`${singularCollection}.name`]: 1,
    [`${singularCollection}.userCache`]: 1,
    [`${singularCollection}.assigneeLinks`]: 1,
    [`${singularCollection}.createdAt`]: 1,
    [`${singularCollection}.status`]: 1,
  };
};

const getCollectionAssigneeInput = ({ collection, singularCollection }) => {
  if (collection === INSURANCES_COLLECTION) {
    return `$insuranceRequestCache.assigneeLinks`;
  }

  return `$${singularCollection}.assigneeLinks`;
};

const addCollectionFields = ({ filters, singularCollection, collection }) => {
  const addFields = [
    {
      $addFields: {
        [singularCollection]: { $arrayElemAt: [`$${singularCollection}`, 0] },
      },
    },
    { $addFields: { [singularCollection]: { _collection: collection } } },
    {
      $match: getCollectionCreatedAtFilters({ singularCollection, ...filters }),
    },
  ];

  if (collection === INSURANCES_COLLECTION) {
    addFields.push({
      $addFields: {
        insuranceRequestCache: {
          $arrayElemAt: ['$insurance.insuranceRequestCache', 0],
        },
      },
    });
  }

  return addFields;
};

const getStatusChangePipeline = ({ collection, ...filters }) => {
  const singularCollection = collection.slice(0, -1);
  const collectionLink = `${singularCollection}Link`;

  return [
    { $match: getCollectionFilters({ collection, ...filters }) },
    {
      $lookup: {
        from: collection,
        localField: `${collectionLink}._id`,
        foreignField: '_id',
        as: singularCollection,
      },
    },
    {
      $project: {
        _id: 1,
        metadata: 1,
        ...getCollectionFragment({ collection, singularCollection }),
      },
    },
    ...addCollectionFields({ filters, singularCollection, collection }),
    {
      $group: {
        _id: {
          // Extract the main assignee
          assigneeId: {
            $reduce: {
              input: getCollectionAssigneeInput({
                collection,
                singularCollection,
              }),
              initialValue: '',
              in: {
                $cond: {
                  if: { $eq: ['$$this.isMain', true] },
                  then: '$$this._id',
                  else: '',
                },
              },
            },
          },
          prevStatus: '$metadata.details.prevStatus',
          nextStatus: '$metadata.details.nextStatus',
        },
        activities: { $push: '$$ROOT' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.assigneeId',
        statusChanges: {
          $push: {
            prevStatus: '$_id.prevStatus',
            nextStatus: '$_id.nextStatus',
            count: '$count',
          },
        },
        totalStatusChangeCount: { $sum: '$count' },
        [collection]: { $push: `$activities.${singularCollection}` },
      },
    },
    // Simple array flattening, as these ids arrive in the form of an array of arrays
    {
      $addFields: {
        [collection]: {
          $reduce: {
            input: `$${collection}`,
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this'] },
          },
        },
      },
    },
    // Add this stage for consistency
    { $sort: { '_id.assigneeId': 1 } },
  ];
};

const makeCollectionStatusChangeSort = collection => (
  { prevStatus: prevStatusA },
  { prevStatus: prevStatusB },
) => {
  let statusOrder;

  switch (collection) {
    case LOANS_COLLECTION:
      statusOrder = LOAN_STATUS_ORDER;
      break;
    case INSURANCE_REQUESTS_COLLECTION:
      statusOrder = INSURANCE_REQUEST_STATUS_ORDER;
      break;
    case INSURANCES_COLLECTION:
      statusOrder = Object.values(INSURANCE_STATUS);
      break;
    default:
      break;
  }

  return statusOrder.indexOf(prevStatusA) - statusOrder.indexOf(prevStatusB);
};

export const loanStatusChanges = args => {
  const pipeline = assigneeBreakdown(args);

  const results = ActivityService.aggregate(pipeline);

  return results.map(({ statusChanges, ...data }) => ({
    ...data,
    statusChanges: statusChanges.sort(
      ({ prevStatus: prevStatusA }, { prevStatus: prevStatusB }) =>
        LOAN_STATUS_ORDER.indexOf(prevStatusA) -
        LOAN_STATUS_ORDER.indexOf(prevStatusB),
    ),
  }));
};

export const collectionStatusChanges = args => {
  const { collection } = args;
  const pipeline = getStatusChangePipeline(args);

  const results = ActivityService.aggregate(pipeline);

  const res = results.map(({ statusChanges, ...data }) => ({
    ...data,
    statusChanges: statusChanges.sort(
      makeCollectionStatusChangeSort(collection),
    ),
  }));

  return res;
};
