// @flow
import { compose, mapProps, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';
import withMatchParam from 'core/containers/withMatchParam';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import userLoanQuery from 'core/api/loans/queries/userLoan';
import loanFiles from 'core/api/loans/queries/loanFiles';
import appUserQuery from 'core/api/users/queries/appUser';
import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from 'core/api/events/ClientEventService';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';

const withAppUser = withSmartQuery({
  query: () => appUserQuery.clone(),
  queryOptions: { reactive: false, single: true },
  dataName: 'currentUser',
  renderMissingDoc: false,
});

const withUserLoan = withSmartQuery({
  query: ({ loanId }) => userLoanQuery.clone({ loanId }),
  queryOptions: { reactive: true, single: true },
  dataName: 'loan',
  renderMissingDoc: false,
});

const propMapper = mapProps(({ loanId, loan, files = [], ...rest }) => ({
  ...rest,
  loan: { ...loan, documents: files },
}));

export default compose(
  withAppUser,
  withMatchParam('loanId', '/loans/:loanId'),
  withUserLoan,
  mergeFilesWithQuery(loanFiles, 'loan'),
  propMapper,
  withRouter,
);
