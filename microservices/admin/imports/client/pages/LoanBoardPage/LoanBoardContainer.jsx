import { compose, mapProps, withProps } from 'recompose';
import merge from 'lodash/merge';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { adminLoans } from 'core/api/loans/queries';
import { adminUsers } from 'core/api/users/queries';
import { adminPromotions } from 'core/api/promotions/queries';
import { adminOrganisations } from 'core/api/organisations/queries';
import { ORGANISATION_FEATURES, ROLES } from 'core/api/constants';
import { userCache } from 'core/api/loans/links';
import {
  groupLoans,
  makeClientSideFilter,
  additionalLoanBoardFields,
} from './loanBoardHelpers';
import { GROUP_BY, NO_PROMOTION } from './loanBoardConstants';
import { withLiveSync, addLiveSync } from './liveSync';

const defaultBody = {
  adminNotes: 1,
  borrowers: { name: 1 },
  category: 1,
  createdAt: 1,
  customName: 1,
  name: 1,
  nextDueTask: 1,
  promotions: { name: 1, status: 1 },
  selectedStructure: 1,
  status: 1,
  structures: { wantedLoan: 1, id: 1, propertyId: 1 },
  properties: { address1: 1 },
  tasksCache: 1,
  user: {
    ...userCache,
    // FIXME: This is a grapher bug, you can't just put "assignedEmployeeCache: 1" here
    assignedEmployeeCache: { _id: 1, firstName: 1, lastName: 1 },
  },
  financedPromotion: { name: 1, status: 1 },
  userId: 1,
  selectedLenderOrganisation: { name: 1 },
  revenues: { _id: 1, status: 1 },
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

const getPromotionId = promotionId =>
  noPromotionIsChecked(promotionId) ? undefined : promotionId;

export default compose(
  addLiveSync,
  withLiveSync,
  withSmartQuery({
    query: adminLoans,
    params: ({
      options: {
        assignedEmployeeId,
        step,
        groupBy,
        status,
        promotionId,
        lenderId,
        category,
        additionalFields,
      },
    }) => ({
      $body: getQueryBody(additionalFields),
      assignedEmployeeId,
      step,
      relevantOnly: true,
      hasPromotion: groupBy === GROUP_BY.PROMOTION,
      status,
      promotionId: getPromotionId(promotionId),
      lenderId,
      category,
      noPromotion: noPromotionIsChecked(promotionId),
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
