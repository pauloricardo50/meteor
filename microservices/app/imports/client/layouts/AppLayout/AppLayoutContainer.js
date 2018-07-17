// @flow
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import withMatchParam from 'core/containers/withMatchParam';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import userLoanQuery from 'core/api/loans/queries/userLoan';
import appUserQuery from 'core/api/users/queries/appUser';

export default compose(
  withSmartQuery({
    query: () => appUserQuery.clone(),
    queryOptions: { reactive: true, single: true },
    dataName: 'currentUser',
    renderMissingDoc: false,
  }),
  withMatchParam('loanId', '/loans/:loanId'),
  withSmartQuery({
    query: ({ loanId }) => userLoanQuery.clone({ loanId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'loan',
    renderMissingDoc: false,
  }),
  mapProps(({ loanId, ...rest }) => ({ ...rest })),
  withRouter,
);
