import { compose, withReducer, mapProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { adminLoans } from 'core/api/loans/queries';
import { adminUsers } from 'core/api/users/queries';
import { adminPromotions } from 'core/api/promotions/queries';
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
      options: { assignedEmployeeId, step, groupBy, status, promotionId },
    }) => ({
      $body: getBody(groupBy),
      assignedEmployeeId,
      step,
      relevantOnly: true,
      hasPromotion: groupBy === GROUP_BY.PROMOTION,
      status,
      promotionId,
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
  mapProps(({ loans, options, ...rest }) => ({
    data: groupLoans(loans, options),
    options,
    ...rest,
  })),
);
