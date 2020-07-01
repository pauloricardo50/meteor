import { Meteor } from 'meteor/meteor';

import merge from 'lodash/merge';
import uniq from 'lodash/uniq';

import { ACTIVITY_EVENT_METADATA } from '../../activities/activityConstants';
import ActivityService from '../../activities/server/ActivityService';
import {
  INSURANCE_REQUESTS_COLLECTION,
  INSURANCE_REQUEST_STATUS,
} from '../../insuranceRequests/insuranceRequestConstants';
import { INSURANCES_COLLECTION } from '../../insurances/insuranceConstants';
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

const getCollectionReferralFilter = ({
  collection,
  singularCollection,
  organisationId,
}) => {
  const filters = {};

  if (organisationId) {
    if (collection === INSURANCES_COLLECTION) {
      filters[
        `${singularCollection}.insuranceRequestCache.userCache.referredByOrganisationLink`
      ] = organisationId;
    } else {
      filters[
        `${singularCollection}.userCache.referredByOrganisationLink`
      ] = organisationId;
    }
  }

  return filters;
};

const getCollectionAcquisitionChannelFilter = ({
  collection,
  singularCollection,
  acquisitionChannel,
}) => {
  const filters = {};

  if (acquisitionChannel) {
    if (collection === INSURANCES_COLLECTION) {
      filters[
        `${singularCollection}.insuranceRequestCache.userCache.acquisitionChannel`
      ] = acquisitionChannel;
    } else {
      filters[
        `${singularCollection}.userCache.acquisitionChannel`
      ] = acquisitionChannel;
    }
  }

  return filters;
};

const getCollectionFilters = ({ collection, fromDate, toDate }) => {
  const filters = { ...COLLECTION_INITIAL_FILTERS[collection] };

  if (fromDate) {
    filters.createdAt = { $gte: fromDate };
  }

  if (toDate) {
    filters.createdAt = filters.createdAt || {};
    filters.createdAt.$lte = toDate;
  }

  return filters;
};

const getRawCollectionFragment = collection => {
  if (collection === INSURANCES_COLLECTION) {
    return {
      _id: 1,
      name: 1,
      insuranceRequestCache: 1,
      createdAt: 1,
      status: 1,
    };
  }

  return {
    _id: 1,
    name: 1,
    userCache: 1,
    assigneeLinks: 1,
    createdAt: 1,
    status: 1,
  };
};

const prefixObjectKeys = (obj, prefix) =>
  Object.keys(obj).reduce((o, key) => ({ ...o, [prefix + key]: obj[key] }), {});

const getCollectionFragment = ({ collection, singularCollection }) =>
  prefixObjectKeys(
    getRawCollectionFragment(collection),
    `${singularCollection}.`,
  );

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
  ];

  if (collection === INSURANCES_COLLECTION) {
    addFields.push({
      $addFields: {
        insuranceRequestCache: {
          $arrayElemAt: ['$insurance.insuranceRequestCache', 0],
        },
      },
    });
  } else {
    addFields.push({
      $match: {
        [`${singularCollection}.status`]: {
          $nin: [LOAN_STATUS.TEST, INSURANCE_REQUEST_STATUS.TEST],
        },
      },
    });
  }

  addFields.push({
    $match: getCollectionReferralFilter({
      singularCollection,
      collection,
      ...filters,
    }),
  });

  addFields.push({
    $match: getCollectionAcquisitionChannelFilter({
      singularCollection,
      collection,
      ...filters,
    }),
  });

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
      $addFields: {
        mainAssigneeId: {
          $arrayElemAt: [
            {
              $filter: {
                input: getCollectionAssigneeInput({
                  collection,
                  singularCollection,
                }),
                cond: { $eq: ['$$this.isMain', true] },
              },
            },
            0,
          ],
        },
      },
    },
    { $addFields: { mainAssigneeId: '$mainAssigneeId._id' } },
    { $match: { mainAssigneeId: { $exists: true } } },
    {
      $group: {
        _id: {
          mainAssigneeId: '$mainAssigneeId',
          nextStatus: '$metadata.details.nextStatus',
        },
        count: { $sum: 1 },
        docIds: { $push: `$${singularCollection}._id` },
      },
    },
    { $sort: { '_id.mainAssigneeId': 1 } },
  ];
};

export const collectionStatusChanges = args => {
  const pipeline = getStatusChangePipeline(args);

  const results = ActivityService.aggregate(pipeline);
  const combinedResults = results.reduce(
    (arr, { count, _id: { mainAssigneeId, nextStatus }, docIds = [] }) => {
      const currentValue = arr.find(({ _id }) => _id === mainAssigneeId);
      const filteredArray = arr.filter(({ _id }) => _id !== mainAssigneeId);
      return [
        ...filteredArray,
        {
          ...currentValue,
          _id: mainAssigneeId,
          [nextStatus]: count,
          docIds: [...(currentValue?.docIds || []), ...docIds],
        },
      ];
    },
    [],
  );

  const filteredUniques = combinedResults.map(obj => {
    const uniques = uniq(obj.docIds);
    return {
      ...obj,
      docIds: uniques,
      uniques: uniques.length,
    };
  });

  return filteredUniques;
};
