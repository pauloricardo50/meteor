import React from 'react';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import uniq from 'lodash/uniq';
import { compose, withProps } from 'recompose';

import { INTEREST_RATES } from '../../../../api/interestRates/interestRatesConstants';
import T from '../../../Translation';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import { Consumer } from './FinancingOffersContainer';

const withContext = Component => props => (
  <Consumer>{sortState => <Component {...props} {...sortState} />}</Consumer>
);

export const getAvailableRates = (offers, loan) => {
  const rates = [];

  offers.forEach(offer => {
    const offerRates = pick(offer, Object.values(INTEREST_RATES));
    const validRates = pickBy(offerRates, v => v);
    rates.push(...Object.keys(validRates));
  });

  loan.structures.forEach(({ loanTranches }) => {
    if (loanTranches) {
      loanTranches.forEach(({ type }) => {
        rates.push(type);
      });
    }
  });

  return uniq(rates);
};

const withOptions = withProps(({ offers, loan }) => ({
  options: [
    { id: 'maxAmount' },
    { id: 'amortization' },
    { id: 'averagedRate' },
    ...getAvailableRates(offers, loan).map(rate => ({ id: rate })),
  ].map(({ id }) => ({
    id,
    label: <T id={`offer.${id}`} />,
  })),
}));

export default compose(FinancingDataContainer, withContext, withOptions);
