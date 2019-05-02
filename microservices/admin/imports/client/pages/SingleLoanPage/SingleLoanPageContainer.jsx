import { compose, mapProps } from 'recompose';
import query from 'core/api/loans/queries/adminLoans';
import { withSmartQuery } from 'core/api';
import withTranslationContext from 'core/components/Translation/withTranslationContext';
import interestRates from 'core/api/interestRates/queries/currentInterestRates';
import {
  injectCalculator,
  withCalculator,
} from 'core/containers/withCalculator';

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
    params: ({ match }) => ({ _id: match.params.loanId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'loan',
  }),
  injectCalculator(),
  withTranslationContext(({ loan = {} }) => ({
    purchaseType: loan.purchaseType,
  })),
  withInterestRates,
  mapProps(({ loan, currentInterestRates, ...props }) => ({
    ...props,
    loan: { ...loan, currentInterestRates: currentInterestRates.averageRates },
  })),
  withCalculator,
);
