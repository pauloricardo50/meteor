// @flow
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import withMatchParam from 'core/containers/withMatchParam';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import userLoanQuery from 'core/api/loans/queries/userLoan';
import loanFiles from 'core/api/loans/queries/loanFiles';
import appUserQuery from 'core/api/users/queries/appUser';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';

const withAppUser = withSmartQuery({
  query: () => appUserQuery.clone(),
  queryOptions: { reactive: true, single: true },
  dataName: 'currentUser',
  renderMissingDoc: false,
});

const withUserLoan = withSmartQuery({
  query: ({ loanId }) => userLoanQuery.clone({ loanId }),
  queryOptions: { reactive: true, single: true },
  dataName: 'loan',
  renderMissingDoc: false,
});

export default compose(
  withAppUser,
  withMatchParam('loanId', '/loans/:loanId'),
  withUserLoan,
  mergeFilesWithQuery(loanFiles, 'loan'),
  withRouter,
);
