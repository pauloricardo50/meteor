import React from 'react';
import { compose, withProps } from 'recompose';
import pick from 'lodash/pick';

import { INTEREST_RATES } from '../../../../../api/constants';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import StructureUpdateContainer from '../../containers/StructureUpdateContainer';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import FinancingCalculator from '../../FinancingCalculator';
import { Consumer } from '../FinancingOffersContainer';
import {
  getAmortizationForStructureWithOffer,
  getInterestsForStructureWithOffer,
  getMonthlyForStructureWithOffer,
} from './offerPickerHelpers';

const offerEnhancer = withProps(props => ({
  offers: props.offers.map(offer => ({
    ...offer,
    rates: pick(offer, Object.values(INTEREST_RATES)),
    averagedRate: FinancingCalculator.getAveragedInterestRate({
      tranches: props.structure.loanTranches,
      rates: offer,
    }),
    hasInvalidInterestRates: FinancingCalculator.checkInterestsAndTranches({
      tranches: props.structure.loanTranches,
      interestRates: offer,
    }),
    amortization: getAmortizationForStructureWithOffer(props),
    interests: getInterestsForStructureWithOffer(props),
    monthly: getMonthlyForStructureWithOffer(props),
  })),
}));

const withOfferSortContext = Component => props => (
  <Consumer>
    {({ sortBy }) => <Component {...props} sortBy={sortBy} />}
  </Consumer>
);

const makeOfferSorter = sortBy => (offerA, offerB) =>
  offerA[sortBy] - offerB[sortBy];

const withSortedOffers = withProps(({ offers, sortBy }) => ({
  offers: offers.sort(makeOfferSorter(sortBy)),
}));

export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
  StructureUpdateContainer,
  offerEnhancer,
  withOfferSortContext,
  withSortedOffers,
);
