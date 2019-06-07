import { compose, withReducer, mapProps } from 'recompose';

import adminLoans from 'core/api/loans/queries/adminLoans';
import { withSmartQuery } from 'core/api/containerToolkit/index';
import { groupLoans, filterReducer, getInitialOptions } from './loanBoardHelpers';

export default compose(
  withReducer('options', 'dispatch', filterReducer, getInitialOptions),
  withSmartQuery({
    query: adminLoans,
    params: ({ options: { assignedEmployeeId } }) => ({
      $body: { name: 1, status: 1 },
      assignedEmployeeId,
    }),
    dataName: 'loans',
    queryOptions: {},
  }),
  mapProps(({ loans, options, ...rest }) => ({
    data: groupLoans(loans, options),
    ...rest,
  })),
);
