import { compose, withReducer, mapProps, withState } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { adminLoans } from 'core/api/loans/queries';
import { adminUsers } from 'core/api/users/queries';
import { adminPromotions } from 'core/api/promotions/queries';
import { adminOrganisations } from 'core/api/organisations/queries';
import { ORGANISATION_FEATURES, ROLES } from 'core/api/constants';
import { userCache, tasksCache } from 'core/api/loans/links';
import {
  groupLoans,
  filterReducer,
  getInitialOptions,
} from './loanBoardHelpers';
import { GROUP_BY, NO_PROMOTION } from './loanBoardConstants';
import { withLiveSync, addLiveSync } from './liveSync';

const defaultBody = {
  adminNote: 1,
  createdAt: 1,
  name: 1,
  nextDueTask: 1,
  promotions: { name: 1 },
  selectedStructure: 1,
  status: 1,
  structures: { wantedLoan: 1, id: 1 },
  tasks: tasksCache,
  user: userCache,
};

const noPromotionIsChecked = promotionId =>
  promotionId && promotionId.$in.includes(NO_PROMOTION);

export default compose(
  withState('activateSync', 'setActivateSync', false),
  withReducer('options', 'dispatch', filterReducer, getInitialOptions),
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
    queryOptions: {},
  }),
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
