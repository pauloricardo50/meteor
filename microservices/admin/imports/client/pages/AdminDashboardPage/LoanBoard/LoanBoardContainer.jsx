import { compose, withReducer, mapProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { adminLoans } from 'core/api/loans/queries';
import { adminUsers } from 'core/api/users/queries';
import {
  groupLoans,
  filterReducer,
  getInitialOptions,
} from './loanBoardHelpers';

export default compose(
  withReducer('options', 'dispatch', filterReducer, getInitialOptions),
  withSmartQuery({
    query: adminLoans,
    params: ({ options: { assignedEmployeeId, step } }) => ({
      $body: {
        name: 1,
        status: 1,
        createdAt: 1,
        userCache: 1,
      },
      assignedEmployeeId,
      step,
      relevantOnly: true,
    }),
    dataName: 'loans',
    queryOptions: {},
  }),
  withSmartQuery({
    query: adminUsers,
    params: { $body: { name: 1 }, admins: true },
    dataName: 'admins',
    queryOptions: { shouldRefetch: () => false },
    refetchOnMethodCall: false,
  }),
  mapProps(({ loans, options, ...rest }) => ({
    data: groupLoans(loans, options),
    options,
    ...rest,
  })),
);
