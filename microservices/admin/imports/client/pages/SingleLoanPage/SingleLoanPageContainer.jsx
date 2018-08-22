import { compose } from 'recompose';
import query from 'core/api/loans/queries/adminLoan';
import loanFiles from 'core/api/loans/queries/loanFiles';
import { withSmartQuery } from 'core/api';
import { mergeFilesIntoLoanStructure } from 'core/api/files/mergeFilesWithQuery';

export default compose(
  withSmartQuery({
    query: ({ match }) => query.clone({ _id: match.params.loanId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'loan',
  }),
  mergeFilesIntoLoanStructure(loanFiles, 'loan'),
);
