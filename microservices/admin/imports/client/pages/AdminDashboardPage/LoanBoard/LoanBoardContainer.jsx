import { compose, withReducer, mapProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { adminLoans } from 'core/api/loans/queries';
import { adminUsers } from 'core/api/users/queries';
import { adminPromotions } from 'core/api/promotions/queries';
import { adminOrganisations } from 'core/api/organisations/queries';
import { ORGANISATION_FEATURES } from 'core/api/constants';
import {
  groupLoans,
  filterReducer,
  getInitialOptions,
} from './loanBoardHelpers';
import { GROUP_BY } from './loanBoardConstants';

const getBody = (groupBy) => {
  switch (groupBy) {
  case GROUP_BY.PROMOTION:
    return {
      name: 1,
      status: 1,
      createdAt: 1,
      userCache: 1,
      promotions: { name: 1 },
    };

  default:
    return { name: 1, status: 1, createdAt: 1, userCache: 1 };
  }
};

export default compose(
  withReducer('options', 'dispatch', filterReducer, getInitialOptions),
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
      $body: getBody(groupBy),
      assignedEmployeeId,
      step,
      relevantOnly: true,
      hasPromotion: groupBy === GROUP_BY.PROMOTION,
      status,
      promotionId,
      lenderId,
      category,
    }),
    dataName: 'loans',
    queryOptions: {},
  }),
  withSmartQuery({
    query: adminUsers,
    params: { $body: { firstName: 1 }, admins: true },
    dataName: 'admins',
    queryOptions: { shouldRefetch: () => false },
    refetchOnMethodCall: false,
  }),
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
