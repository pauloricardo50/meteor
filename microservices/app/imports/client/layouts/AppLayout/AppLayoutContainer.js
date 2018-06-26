// @flow
import { compose, mapProps } from 'recompose';
import withMatchParam from 'core/containers/withMatchParam';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import userLoanQuery from 'core/api/loans/queries/userLoan';
import appUserQuery from 'core/api/users/queries/appUser';

export default compose(
  withMatchParam('loanId'),
  withSmartQuery({
    query: () => appUserQuery.clone(),
    queryOptions: { reactive: true, single: true },
    dataName: 'currentUser',
  }),
  withSmartQuery({
    query: ({ loanId }) => userLoanQuery.clone({ loanId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'loan',
    renderMissingDoc: false,
  }),
  mapProps(({ loanId, ...rest }) => ({ ...rest })),
);
