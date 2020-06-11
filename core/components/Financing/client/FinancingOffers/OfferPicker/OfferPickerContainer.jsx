import React from 'react';
import pick from 'lodash/pick';
import { compose, withProps } from 'recompose';

import { INTEREST_RATES } from '../../../../../api/interestRates/interestRatesConstants';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import StructureUpdateContainer from '../../containers/StructureUpdateContainer';
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
      interestRates: offer,
    }),
    hasInvalidInterestRates: FinancingCalculator.checkInterestsAndTranches({
      tranches: props.structure.loanTranches,
      interestRates: offer,
    }),
    amortization: getAmortizationForStructureWithOffer({ ...props, offer }),
    interests: getInterestsForStructureWithOffer({ ...props, offer }),
    monthly: getMonthlyForStructureWithOffer({ ...props, offer }),
  })),
}));

const withOfferSortContext = Component => props => (
  <Consumer>
    {({ sortBy }) => <Component {...props} sortBy={sortBy} />}
  </Consumer>
);

const descendingSort = ['maxAmount', 'amortization'];

const makeOfferSorter = sortBy => (offerA, offerB) => {
  if (descendingSort.includes(sortBy)) {
    return offerB[sortBy] - offerA[sortBy];
  }

  return offerA[sortBy] - offerB[sortBy];
};

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
