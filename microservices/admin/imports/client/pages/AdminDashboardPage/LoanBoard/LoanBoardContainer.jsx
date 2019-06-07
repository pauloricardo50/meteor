import { compose, withReducer, mapProps } from 'recompose';

import adminLoans from 'core/api/loans/queries/adminLoans';
import { withSmartQuery } from 'core/api/containerToolkit/index';
import adminUsers from 'core/api/users/queries/adminUsers';
import {
  groupLoans,
  filterReducer,
  getInitialOptions,
} from './loanBoardHelpers';

export default compose(
  withReducer('options', 'dispatch', filterReducer, getInitialOptions),
  withSmartQuery({
    query: adminLoans,
    params: ({ options: { assignedEmployeeId } }) => ({
      $body: {
        name: 1,
        status: 1,
        createdAt: 1,
        userCache: 1,
      },
      assignedEmployeeId,
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
