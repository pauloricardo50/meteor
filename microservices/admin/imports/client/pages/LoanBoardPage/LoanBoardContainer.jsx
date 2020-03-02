import { compose, mapProps, withProps } from 'recompose';
import merge from 'lodash/merge';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { adminUsers } from 'core/api/users/queries';
import { adminPromotions } from 'core/api/promotions/queries';
import { adminOrganisations } from 'core/api/organisations/queries';
import {
  ORGANISATION_FEATURES,
  ROLES,
  LOANS_COLLECTION,
  LOAN_STATUS,
} from 'core/api/constants';
import {
  groupLoans,
  makeClientSideFilter,
  additionalLoanBoardFields,
} from './loanBoardHelpers';
import { GROUP_BY, NO_PROMOTION } from './loanBoardConstants';
import { withLiveSync, addLiveSync } from './liveSync';

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
  user: { name: 1 },
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

const getQueryFilters = ({
  assignedEmployeeId,
  step,
  groupBy,
  status,
  promotionId,
  lenderId,
  category,
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
    status: {
      $nin: [LOAN_STATUS.TEST, LOAN_STATUS.UNSUCCESSFUL],
      ...status,
    },
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
  }),
  withProps(({ loans, ...props }) => ({
    loans: loans.filter(makeClientSideFilter(props)),
  })),
  withProps(({ refetch }) => ({ refetchLoans: refetch })),
  withSmartQuery({
    query: adminUsers,
    params: { $body: { firstName: 1 }, roles: [ROLES.ADMIN, ROLES.DEV] },
    dataName: 'admins',
    queryOptions: { shouldRefetch: () => false },
    refetchOnMethodCall: false,
  }),
  mapProps(({ admins, ...rest }) => ({
    devAndAdmins: admins,
    admins: admins.filter(({ roles }) => roles.includes(ROLES.ADMIN)),
    devs: admins.filter(({ roles }) => roles.includes(ROLES.DEV)),
    ...rest,
  })),
  withSmartQuery({
    query: adminPromotions,
    params: { $body: { name: 1 } },
    dataName: 'promotions',
    queryOptions: { shouldRefetch: () => false },
    refetchOnMethodCall: false,
  }),
  withSmartQuery({
    query: adminOrganisations,
    params: { $body: { name: 1 }, features: ORGANISATION_FEATURES.LENDER },
    dataName: 'lenders',
    queryOptions: { shouldRefetch: () => false },
    refetchOnMethodCall: false,
  }),
  mapProps(({ loans, ...rest }) => ({
    data: groupLoans({ loans, ...rest }),
    ...rest,
  })),
);
