import merge from 'lodash/merge';
import { compose, withProps } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { calculatorLoan } from 'core/api/fragments';
import { currentInterestRates as currentInterestRatesQuery } from 'core/api/interestRates/queries';
import { userLoans } from 'core/api/loans/queries';
import withTranslationContext from 'core/components/Translation/withTranslationContext';
import { injectCalculator } from 'core/containers/withCalculator';
import withMatchParam from 'core/containers/withMatchParam';
import useCurrentUser from 'core/hooks/useCurrentUser';
import useMeteorData from 'core/hooks/useMeteorData';

import { withSideNavContextProvider } from './SideNavContext';

const loanFragment = merge({}, calculatorLoan(), {
  acquisitionStatus: 1,
  assignees: { name: 1, phoneNumber: 1, email: 1 },
  borrowers: { age: 1, name: 1, $options: { sort: { createdAt: 1 } } },
  contacts: 1,
  customName: 1,
  displayWelcomeScreen: 1,
  enableOffers: 1,
  lenders: {
    offers: {
      conditions: 1,
      enableOffer: 1,
      withCounterparts: 1,
    },
    organisation: { logo: 1 },
  },
  maxPropertyValue: 1,
  name: 1,
  promotionOptions: {
    name: 1,
    priorityOrder: 1,
    promotionLots: { reducedStatus: 1, value: 1 },
  },
  promotions: {
    documents: 1,
    lenderOrganisationLink: 1,
    name: 1,
    status: 1,
    users: { name: 1, organisations: { name: 1 } },
  },
  properties: { address: 1, $options: { sort: { createdAt: 1 } } },
  shareSolvency: 1,
  showClosingChecklists: 1,
  step: 1,
  userCache: 1,
  userFormsEnabled: 1,
});

const withUserLoan = withSmartQuery({
  query: userLoans,
  params: ({ loanId }) => ({ loanId, $body: loanFragment }),
  deps: ({ loanId }) => {
    // Make sure the currentUser is in the dependencies here, or else
    // the query can get stuck when it's undefined on initial launch
    const currentUser = useCurrentUser();
    return [loanId, currentUser?._id];
  },
  queryOptions: { reactive: true, single: true },
  dataName: 'loan',
  skip: ({ loanId }) => !loanId,
});

export default compose(
  withMatchParam('loanId', '/loans/:loanId'),
  withUserLoan,
  injectCalculator(),
  withProps(({ loan }) => {
    const { data: currentInterestRates } = useMeteorData({
      query: loan && currentInterestRatesQuery,
      refetchOnMethodCall: false,
    });

    if (!loan) {
      return;
    }

    return {
      loan: {
        ...loan,
        currentInterestRates: currentInterestRates?.averageRates,
      },
    };
  }),
  withTranslationContext(({ loan = {} }) => ({
    purchaseType: loan.purchaseType,
  })),
  withSideNavContextProvider,
);
