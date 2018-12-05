import { compose, mapProps } from 'recompose';
import query from 'core/api/loans/queries/adminLoan';
import loanFiles from 'core/api/loans/queries/loanFiles';
import { withSmartQuery } from 'core/api';
import { mergeFilesIntoLoanStructure } from 'core/api/files/mergeFilesWithQuery';
import interestRates from 'core/api/interestRates/queries/currentInterestRates';

const withInterestRates = withSmartQuery({
  query: interestRates,
  queryOptions: { reactive: false },
  dataName: 'currentInterestRates',
  smallLoader: true,
});

export default compose(
  withSmartQuery({
    query,
    params: ({ match }) => ({ _id: match.params.loanId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'loan',
  }),
  mergeFilesIntoLoanStructure(
    loanFiles,
    ({ loan: { _id: loanId } }) => ({ loanId }),
    'loan',
  ),
  withInterestRates,
  mapProps(({ loan, currentInterestRates, ...props }) => ({
    ...props,
    loan: { ...loan, currentInterestRates: currentInterestRates.averageRates },
  })),
);
