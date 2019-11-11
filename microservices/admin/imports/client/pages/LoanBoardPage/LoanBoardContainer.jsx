import { compose, mapProps, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { adminLoans } from 'core/api/loans/queries';
import { adminUsers } from 'core/api/users/queries';
import { adminPromotions } from 'core/api/promotions/queries';
import { adminOrganisations } from 'core/api/organisations/queries';
import { ORGANISATION_FEATURES, ROLES } from 'core/api/constants';
import { userCache } from 'core/api/loans/links';
import { groupLoans } from './loanBoardHelpers';
import { GROUP_BY, NO_PROMOTION } from './loanBoardConstants';
import { withLiveSync, addLiveSync } from './liveSync';

const defaultBody = {
  adminNote: 1,
  borrowers: { name: 1 },
  category: 1,
  createdAt: 1,
  customName: 1,
  name: 1,
  nextDueTask: 1,
  promotions: { name: 1 },
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
  financedPromotionLink: 1,
  userId: 1,
};

const noPromotionIsChecked = promotionId =>
  promotionId && promotionId.$in.includes(NO_PROMOTION);

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
      },
    }) => ({
      $body: defaultBody,
      assignedEmployeeId,
      step,
      relevantOnly: true,
      hasPromotion: groupBy === GROUP_BY.PROMOTION,
      status,
      promotionId,
      lenderId,
      category,
      noPromotion: noPromotionIsChecked(promotionId),
    }),
    dataName: 'loans',
    queryOptions: { pollingMs: 5000 },
  }),
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
