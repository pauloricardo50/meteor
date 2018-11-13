import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { offerInsert } from 'core/api';
import { withProps, compose } from 'recompose';
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
  organisation,
  maxAmount,
  amortizationGoal,
  amortizationYears,
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
    amortizationGoal,
    amortizationYears,
    ...reformatInterestRatesObject(interestRates, STANDARD_SUFFIX),
  };
  const counterpartOffer = hasCounterparts
    ? {
      maxAmount,
      amortizationGoal,
      amortizationYears,
      ...reformatInterestRatesObject(
        interestRates,
        // If a discount exists, use the standard rates and add a discounter to
        // each rate
        useDiscount ? STANDARD_SUFFIX : COUNTERPART_SUFFIX,
        useDiscount ? makeRateDiscounter(discount) : undefined,
      ),
    }
    : undefined;

  return [
    {
      loanId,
      organisationLink: { _id: organisation },
      conditions: [conditions].filter(x => x),
      ...standardOffer,
    },
    hasCounterparts && {
      loanId,
      organisationLink: { _id: organisation },
      conditions: [conditions, counterparts].filter(x => x),
      ...counterpartOffer,
    },
  ].filter(offer => !!offer);
};

const onSubmit = (values, loanId) => {
  const offers = mapValuesToOffer({ ...values, loanId });
  return Promise.all(offers.map(offer => offerInsert.run({ offer, loanId })));
};

export default compose(
  withProps(({ loanId }) => ({
    onSubmit: values => onSubmit(values, loanId),
  })),
  connect(state => ({
    [HAS_COUNTERPARTS]: selector(state, HAS_COUNTERPARTS),
    [IS_DISCOUNT]: selector(state, IS_DISCOUNT),
  })),
);
