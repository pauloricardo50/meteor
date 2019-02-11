import { compose, mapProps } from 'recompose';
import query from 'core/api/loans/queries/adminLoan';
import loanFiles from 'core/api/loans/queries/loanFiles';
import { withSmartQuery } from 'core/api';
import { mergeFilesIntoLoanStructure } from 'core/api/files/mergeFilesWithQuery';
import withTranslationContext from 'core/components/Translation/withTranslationContext';
import interestRates from 'core/api/interestRates/queries/currentInterestRates';

const withInterestRates = withSmartQuery({
  query: interestRates,
  queryOptions: { reactive: false, shouldRefetch: () => false },
  dataName: 'currentInterestRates',
  smallLoader: true,
  refetchOnMethodCall: false,
});

export default compose(
  withSmartQuery({
    query,
    params: ({ match }) => ({ loanId: match.params.loanId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'loan',
  }),
  mergeFilesIntoLoanStructure(
    loanFiles,
    ({ loan: { _id: loanId } }) => ({ loanId }),
    'loan',
  ),
  withTranslationContext(({ loan = {} }) => ({
    purchaseType: loan.purchaseType,
  })),
  withInterestRates,
  mapProps(({ loan, currentInterestRates, ...props }) => ({
    ...props,
    loan: { ...loan, currentInterestRates: currentInterestRates.averageRates },
  })),
);
