import React from 'react';
import merge from 'lodash/merge';
import { branch, compose, mapProps, renderComponent } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { calculatorLoan } from 'core/api/fragments';
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

const fullLoanFragment = merge({}, calculatorLoan(), {
  adminNotes: 1,
  applicationType: 1,
  assigneeLinks: 1,
  borrowers: { age: 1, name: 1, $options: { sort: { createdAt: 1 } } },
  category: 1,
  contacts: 1,
  customName: 1,
  enableOffers: 1,
  financedPromotion: { name: 1, status: 1 },
  frontTagId: 1,
  insuranceRequests: {
    status: 1,
    name: 1,
    borrowers: { name: 1 },
    createdAt: 1,
    updatedAt: 1,
  },
  lenders: {
    adminNote: 1,
    contact: { firstName: 1, name: 1, email: 1 },
    offers: {
      enableOffer: 1,
      conditions: 1,
      withCounterparts: 1,
      documents: 1,
    },
    organisation: { logo: 1 },
    status: 1,
  },
  maxPropertyValue: 1,
  name: 1,
  promotionOptions: { name: 1 },
  promotions: {
    agreementDuration: 1,
    lenderOrganisationLink: 1,
    name: 1,
    users: { name: 1 },
  },
  proNote: 1,
  properties: { address: 1, $options: { sort: { createdAt: 1 } } },
  shareSolvency: 1,
  showClosingChecklists: 1,
  status: 1,
  step: 1,
  unsuccessfulReason: 1,
  userCache: 1,
  userFormsEnabled: 1,
});

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
