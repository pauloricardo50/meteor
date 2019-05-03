import { compose, mapProps, shouldUpdate } from 'recompose';
import query from 'core/api/loans/queries/adminLoans';
import { withSmartQuery } from 'core/api';
import withTranslationContext from 'core/components/Translation/withTranslationContext';
import interestRates from 'core/api/interestRates/queries/currentInterestRates';
import { arePathsUnequal } from 'core/utils/reactFunctions';

const withInterestRates = withSmartQuery({
  query: interestRates,
  queryOptions: { reactive: false, shouldRefetch: () => false },
  dataName: 'currentInterestRates',
  smallLoader: true,
  refetchOnMethodCall: false,
});

export default compose(
  shouldUpdate(arePathsUnequal(['match.params.loanId'])),
  withSmartQuery({
    query,
    params: ({ match }) => ({ _id: match.params.loanId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'loan',
  }),
  withTranslationContext(({ loan = {} }) => ({
    purchaseType: loan.purchaseType,
  })),
  withInterestRates,
  mapProps(({ loan, currentInterestRates, ...props }) => ({
    ...props,
    loan: { ...loan, currentInterestRates: currentInterestRates.averageRates },
  })),
);
