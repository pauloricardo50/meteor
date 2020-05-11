import React from 'react';
import omit from 'lodash/omit';
import { branch, compose, mapProps, renderComponent } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { adminLoan } from 'core/api/fragments';
import { currentInterestRates as interestRates } from 'core/api/interestRates/queries';
import {
  LOANS_COLLECTION,
  LOAN_CATEGORIES,
} from 'core/api/loans/loanConstants';
import withTranslationContext from 'core/components/Translation/withTranslationContext';
import updateForProps from 'core/containers/updateForProps';
import {
  injectCalculator,
  withCalculator,
} from 'core/containers/withCalculator';
import {
  useReactiveMeteorData,
  useStaticMeteorData,
} from 'core/hooks/useMeteorData';

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
  'revenues',
];
const fullLoanFragment = {
  ...omit(adminLoan({ withSort: true }), keysToOmit),
  revenues: { _id: 1, status: 1 },
  // category: 1,
};

export default compose(
  updateForProps(['match.params.loanId', 'loanId']),
  // withSmartQuery({
  //   query: LOANS_COLLECTION,
  //   params: ({ match, loanId }) => ({
  //     $filters: {
  //       _id: loanId || match.params.loanId,
  //     },
  //     ...fullLoanFragment,
  //   }),
  //   queryOptions: { reactive: true, single: true },
  //   dataName: 'loan',
  // }),
  Component => props => {
    const { loanId, match } = props;
    const _id = loanId || match?.params?.loanId;

    const { data, loading } = useStaticMeteorData(
      {
        query: LOANS_COLLECTION,
        params: { $filters: { _id }, ...fullLoanFragment },
        type: 'single',
      },
      [_id],
    );

    if (loading) {
      return <h2>LOADING</h2>;
    }

    return <Component {...props} loan={data} />;
  },
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
  // FIXME: This is a serious Meteor bug, no idea what's going on
  // Component =>
  //   class extends React.Component {
  //     componentDidCatch(err) {
  //       console.log('err:', err);
  //     }

  //     render() {
  //       return <Component {...this.props} />;
  //     }
  //   },
);
