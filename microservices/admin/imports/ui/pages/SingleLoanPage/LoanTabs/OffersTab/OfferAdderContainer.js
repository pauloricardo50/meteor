import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { compose, createContainer, offerInsert } from 'core/api';
import {
  FORM_NAME,
  HAS_COUNTERPARTS,
  IS_DISCOUNT,
  STANDARD_SUFFIX,
  COUNTERPART_SUFFIX,
} from './constants';

const selector = formValueSelector(FORM_NAME);

const makeRateDiscounter = discount => rate => rate - discount;

// Get all keys that end with the same suffix ("-1" or "-2")
// and return an object that only has those keys without the suffix
const reformatInterestRatesObject = (rates, suffix, valueEnhancer = x => x) =>
  Object.keys(rates)
    .filter(key => key.indexOf(suffix) >= 0)
    .reduce(
      (accumulator, key) => ({
        ...accumulator,
        [key.split(suffix)[0]]: valueEnhancer(rates[key]),
      }),
      {},
    );

const mapValuesToOffer = ({
  loanId,
  organization,
  maxAmount,
  amortization,
  conditions,
  hasCounterparts,
  counterparts,
  isDiscount,
  discount,
  ...interestRates
}) => {
  const useDiscount = isDiscount && discount;
  const standardOffer = {
    maxAmount,
    amortization,
    ...reformatInterestRatesObject(interestRates, STANDARD_SUFFIX),
  };
  const counterpartOffer = hasCounterparts
    ? {
      maxAmount,
      amortization,
      ...reformatInterestRatesObject(
        interestRates,
        // If a discount exists, use the standard rates and add a discounter to
        // each rate
        useDiscount ? STANDARD_SUFFIX : COUNTERPART_SUFFIX,
        useDiscount ? makeRateDiscounter(discount) : undefined,
      ),
    }
    : undefined;

  return {
    loanId,
    organization,
    conditions,
    counterparts,
    standardOffer,
    counterpartOffer,
  };
};

const onSubmit = (values, loanId) => {
  const offer = mapValuesToOffer({ ...values, loanId });
  return offerInsert.run({ offer, loanId });
};

export default compose(
  createContainer(({ loanId }) => ({
    onSubmit: values => onSubmit(values, loanId),
  })),
  connect(state => ({
    [HAS_COUNTERPARTS]: selector(state, HAS_COUNTERPARTS),
    [IS_DISCOUNT]: selector(state, IS_DISCOUNT),
  })),
);
