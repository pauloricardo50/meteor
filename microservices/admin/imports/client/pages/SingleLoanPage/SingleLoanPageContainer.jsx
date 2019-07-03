import { compose, mapProps, branch, renderComponent } from 'recompose';
import omit from 'lodash/omit';

import { adminLoans } from 'core/api/loans/queries';
import { withSmartQuery } from 'core/api';
import withTranslationContext from 'core/components/Translation/withTranslationContext';
import { currentInterestRates as interestRates } from 'core/api/interestRates/queries';
import {
  injectCalculator,
  withCalculator,
} from 'core/containers/withCalculator';
import updateForProps from 'core/containers/updateForProps';
import { LOAN_CATEGORIES } from 'core/api/constants';
import { adminLoan } from 'core/api/fragments';
import PremiumSingleLoanPage from './PremiumSingleLoanPage';

const withInterestRates = withSmartQuery({
  query: interestRates,
  queryOptions: { reactive: false, shouldRefetch: () => false },
  dataName: 'currentInterestRates',
  smallLoader: true,
  refetchOnMethodCall: false,
});

const keysToOmit = [
  'borrowers.loans',
  'contacts',
  'properties.loans',
  'properties.promotion',
  'properties.user',
  'properties.users',
  'user.borrowers',
  'user.loans',
  'user.organisations',
  'user.properties',
];
const fullLoanFragment = omit(adminLoan({ withSort: true }), keysToOmit);

export default compose(
  updateForProps(['match.params.loanId']),
  withSmartQuery({
    query: adminLoans,
    params: ({ match, loanId }) => ({
      _id: loanId || match.params.loanId,
      $body: fullLoanFragment,
    }),
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
  branch(
    ({ loan: { category } }) => category === LOAN_CATEGORIES.PREMIUM,
    renderComponent(PremiumSingleLoanPage),
  ),
);
