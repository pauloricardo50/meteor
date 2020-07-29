import { Roles } from 'meteor/alanning:roles';

import merge from 'lodash/merge';
import { compose, mapProps, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { LOANS_COLLECTION, LOAN_STATUS } from 'core/api/loans/loanConstants';
import {
  ORGANISATIONS_COLLECTION,
  ORGANISATION_FEATURES,
} from 'core/api/organisations/organisationConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';

import { addLiveSync, withLiveSync } from '../liveSync';
import { GROUP_BY, NO_PROMOTION } from './loanBoardConstants';
import {
  additionalLoanBoardFields,
  groupLoans,
  makeClientSideFilter,
} from './loanBoardHelpers';

const defaultBody = {
  adminNotes: 1,
  assigneeLinks: 1,
  borrowers: { name: 1 },
  category: 1,
  createdAt: 1,
  customName: 1,
  financedPromotion: { name: 1, status: 1 },
  mainAssigneeLink: 1,
  name: 1,
  nextDueTask: 1,
  promotions: { name: 1, status: 1 },
  properties: { address1: 1 },
  revenues: { _id: 1, status: 1 },
  selectedLenderOrganisation: { name: 1 },
  selectedStructure: 1,
  status: 1,
  structures: { wantedLoan: 1, id: 1, propertyId: 1 },
  tasksCache: 1,
  user: { name: 1, status: 1 },
  userId: 1,
};

const getQueryBody = additionalFields => {
  const addedFields = additionalLoanBoardFields.filter(({ id }) =>
    additionalFields.includes(id),
  );

  return addedFields.reduce(
    (newBody, { fragment }) => merge({}, newBody, fragment),
    defaultBody,
  );
};

const noPromotionIsChecked = promotionId =>
  promotionId && promotionId.$in.includes(NO_PROMOTION);

const getStatusFilter = status => {
  const { $in = [] } = status || {};
  const toIgnore = [
    LOAN_STATUS.TEST,
    LOAN_STATUS.UNSUCCESSFUL,
    LOAN_STATUS.FINALIZED,
  ];

  return {
    $nin: toIgnore.filter(s => !$in.includes(s)),
    ...status,
  };
};

const getQueryFilters = ({
  assignedEmployeeId,
  step,
  groupBy,
  status,
  promotionId,
  lenderId,
  category,
  purchaseType,
  userStatus,
}) => {
  const $or = [];

  if (groupBy === GROUP_BY.PROMOTION) {
    $or.push({ 'promotionLinks.0._id': { $exists: true } });
    $or.push({ 'financedPromotionLink._id': { $exists: true } });
  }

  if (promotionId) {
    $or.push({ 'promotionLinks.0._id': promotionId });
    $or.push({ 'financedPromotionLink._id': promotionId });
  }

  return {
    assigneeLinks: { $elemMatch: { _id: assignedEmployeeId } },
    step,
    $or: $or.length ? $or : undefined,
    anonymous: { $ne: true },
    status: getStatusFilter(status),
    ...(lenderId
      ? {
          lendersCache: {
            $elemMatch: { 'organisationLink._id': lenderId },
          },
        }
      : {}),
    category,
    ...(noPromotionIsChecked(promotionId)
      ? { promotionLinks: { $in: [[], null] } }
      : {}),
    purchaseType,
    'userCache.status': userStatus,
  };
};

export default compose(
  addLiveSync,
  withLiveSync,
  withSmartQuery({
    query: LOANS_COLLECTION,
    params: ({ options }) => ({
      $filters: getQueryFilters(options),
      ...getQueryBody(options.additionalFields),
    }),
    dataName: 'loans',
    queryOptions: { pollingMs: 5000 },
    deps: ({ options }) => Object.values(options),
  }),
  withProps(({ loans, ...props }) => ({
    loans: loans.filter(makeClientSideFilter(props)),
  })),
  withProps(({ refetch }) => ({ refetchLoans: refetch })),
  withSmartQuery({
    query: USERS_COLLECTION,
    params: {
      $filters: { 'roles._id': ROLES.ADVISOR },
      firstName: 1,
      roles: 1,
      $options: { sort: { firstName: 1 } },
    },
    dataName: 'admins',
    queryOptions: { shouldRefetch: () => false },
    refetchOnMethodCall: false,
  }),
  mapProps(({ admins, ...rest }) => ({
    devAndAdmins: admins,
    admins: admins.filter(user => Roles.userIsInRole(user, ROLES.ADMIN)),
    devs: admins.filter(user => Roles.userIsInRole(user, ROLES.DEV)),
    ...rest,
  })),
  withSmartQuery({
    query: PROMOTIONS_COLLECTION,
    params: { name: 1 },
    dataName: 'promotions',
    queryOptions: { shouldRefetch: () => false },
    refetchOnMethodCall: false,
  }),
  withSmartQuery({
    query: ORGANISATIONS_COLLECTION,
    params: {
      $filters: { features: ORGANISATION_FEATURES.LENDER },
      name: 1,
      $options: { sort: { name: 1 } },
    },
    dataName: 'lenders',
    refetchOnMethodCall: false,
  }),
  mapProps(({ loans, ...rest }) => ({
    data: groupLoans({ loans, ...rest }),
    ...rest,
  })),
);
