import React from 'react';
import omit from 'lodash/omit';
import { branch, compose, mapProps, renderComponent } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { adminLender, adminProperty, userLoan } from 'core/api/fragments';
import { currentInterestRates as interestRates } from 'core/api/interestRates/queries';
import {
  LOANS_COLLECTION,
  LOAN_CATEGORIES,
} from 'core/api/loans/loanConstants';
import Loading from 'core/components/Loading';
import MissingDoc from 'core/components/MissingDoc';
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
  dataName: 'currentInterestRates',
  smallLoader: true,
  refetchOnMethodCall: false,
});

const keysToOmit = [
  'borrowers.loans',
  'contacts',
  'user.borrowers',
  'user.loans',
  'user.organisations',
  'user.properties',
];
const fullLoanFragment = {
  assigneeLinks: 1,
  ...omit(userLoan({ withSort: true }), keysToOmit),
  adminNotes: 1,
  category: 1,
  financedPromotion: { name: 1, status: 1 },
  financedPromotionLink: 1,
  frontTagId: 1,
  lenders: adminLender(),
  maxPropertyValue: 1,
  nextDueTask: 1,
  proNote: 1,
  properties: omit(adminProperty({ withSort: true }), [
    'loans',
    'promotion',
    'user',
    'users',
  ]),
  revenues: { _id: 1, status: 1 },
  selectedLenderOrganisation: { name: 1 },
  status: 1,
  tasksCache: 1,
  userCache: 1,
  insuranceRequests: {
    status: 1,
    name: 1,
    borrowers: { name: 1 },
    createdAt: 1,
    updatedAt: 1,
  },
  unsuccessfulReason: 1,
  mainAssignee: 1,
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

    if (!data) {
      return <MissingDoc />;
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
);
