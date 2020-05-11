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
import Loading from 'core/components/Loading';
import withTranslationContext from 'core/components/Translation/withTranslationContext';
import updateForProps from 'core/containers/updateForProps';
import {
  injectCalculator,
  withCalculator,
} from 'core/containers/withCalculator';
import { useReactiveMeteorData } from 'core/hooks/useMeteorData';

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
};

export default compose(
  updateForProps(['match.params.loanId', 'loanId']),
  Component => props => {
    const { loanId, match } = props;
    const _id = loanId || match?.params?.loanId;

    const { data, loading } = useReactiveMeteorData(
      {
        query: _id && LOANS_COLLECTION,
        params: { $filters: { _id }, ...fullLoanFragment },
        type: 'single',
      },
      [_id],
    );

    if (!_id) {
      return null;
    }

    if (loading) {
      return <Loading />;
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
  //     render() {
  //       return <div>Hello {this.props.loan._id}</div>;
  //     }
  //   },
);
