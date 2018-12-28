import SimpleSchema from 'simpl-schema';
import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api';
import loanLenders from '../../api/lenders/queries/loanLenders';
import { INTEREST_RATES } from '../../api/constants';
import { offerInsert } from '../../api';
import { CUSTOM_AUTOFIELD_TYPES } from '../AutoForm2/constants';

SimpleSchema.extendOptions(['condition', 'customAllowedValues']);

const interestRatesSchema = ({ isDiscount }) =>
  Object.values(INTEREST_RATES).reduce(
    (types, type) => ({
      ...types,
      [`${type}${isDiscount ? 'Discount' : ''}`]: {
        type: Number,
        min: 0,
        max: 1,
        uniforms: { type: CUSTOM_AUTOFIELD_TYPES.PERCENT },
        label: 'Yo!',
        optional: true,
        condition: ({ hasCounterparts, hasFlatDiscount }) =>
          (isDiscount ? hasCounterparts && !hasFlatDiscount : true),
      },
    }),
    {},
  );

const schema = lenders =>
  new SimpleSchema({
    lender: {
      type: String,
      optional: false,
      defaultValue: null,
      allowedValues: [...lenders.map(({ _id }) => _id), null],
      uniforms: {
        transform: (lenderId) => {
          const { organisation, contact } = lenders.find(({ _id }) => lenderId === _id) || {};
          const { name: organisationName } = organisation || { name: 'Aucune' };
          const { name: contactName } = contact || {};
          return contactName
            ? `${organisationName} (${contactName})`
            : organisationName;
        },
        labelProps: { shrink: true },
      },
    },
    maxAmount: {
      type: SimpleSchema.Integer,
      min: 0,
      max: 100000000,
      optional: false,
    },
    fees: {
      type: Number,
      min: 0,
      max: 100000000,
      defaultValue: 0,
      optional: true,
    },
    epotekFees: {
      type: Number,
      min: 0,
      max: 100000000,
      defaultValue: 0,
      optional: true,
    },
    amortizationGoal: {
      type: Number,
      min: 0,
      max: 1,
      uniforms: { type: CUSTOM_AUTOFIELD_TYPES.PERCENT },
      optional: false,
      defaultValue: 0.65,
    },
    amortizationYears: {
      type: SimpleSchema.Integer,
      min: 0,
      max: 100,
      optional: true,
      defaultValue: 15,
    },
    conditions: {
      type: Array,
      optional: true,
      defaultValue: [],
    },
    'conditions.$': {
      type: String,
      optional: true,
    },
    ...interestRatesSchema({ isDiscount: false }),
    hasCounterparts: {
      type: Boolean,
      defaultValue: false,
      optional: true,
    },
    counterparts: {
      type: Array,
      optional: true,
      defaultValue: [],
      condition: ({ hasCounterparts }) => hasCounterparts,
    },
    'counterparts.$': {
      type: String,
      optional: true,
    },
    hasFlatDiscount: {
      type: Boolean,
      defaultValue: true,
      optional: true,
      condition: ({ hasCounterparts }) => hasCounterparts,
    },
    flatDiscount: {
      type: Number,
      min: 0,
      max: 1,
      uniforms: { type: CUSTOM_AUTOFIELD_TYPES.PERCENT },
      optional: true,
      condition: ({ hasCounterparts, hasFlatDiscount }) =>
        hasCounterparts && hasFlatDiscount,
    },
    ...interestRatesSchema({ isDiscount: true }),
  });

const getStandardRatesKeys = key => !key.includes('Discount');
const getDiscountRatesKeys = key => !getStandardRatesKeys(key);

const filterRates = ({ isCounterPartOffer, hasFlatDiscount }) => (key) => {
  if (isCounterPartOffer) {
    return hasFlatDiscount
      ? getStandardRatesKeys(key)
      : getDiscountRatesKeys(key);
  }
  return getStandardRatesKeys(key);
};

const reformatInterestRatesObject = ({
  interestRates,
  isCounterPartOffer,
  hasFlatDiscount,
  flatDiscount,
}) =>
  Object.keys(interestRates)
    .filter(filterRates({ isCounterPartOffer, hasFlatDiscount }))
    .reduce(
      (rates, key) => ({
        ...rates,
        [key.split('Discount')[0]]: hasFlatDiscount
          ? interestRates[key.split('Discount')[0]] - flatDiscount
          : interestRates[key],
      }),
      {},
    );

const mapValuesToOffer = ({
  lender: lenderId,
  maxAmount,
  amortizationGoal,
  amortizationYears,
  fees,
  epotekFees,
  conditions = [],
  hasCounterparts,
  counterparts = [],
  hasFlatDiscount,
  flatDiscount,
  ...interestRates
}) => {
  const standardOffer = {
    maxAmount,
    amortizationGoal,
    amortizationYears,
    ...reformatInterestRatesObject({
      interestRates,
      isCounterPartOffer: false,
    }),
  };

  const counterpartsOffer = hasCounterparts
    ? {
      maxAmount,
      amortizationGoal,
      amortizationYears,
      ...reformatInterestRatesObject({
        interestRates,
        isCounterPartOffer: true,
        hasFlatDiscount,
        flatDiscount,
      }),
    }
    : undefined;

  return [
    {
      lenderId,
      conditions: conditions.filter(x => x),
      fees,
      epotekFees,
      ...standardOffer,
    },
    hasCounterparts && {
      lenderId,
      conditions: [...conditions, ...counterparts].filter(x => x),
      fees,
      epotekFees,
      ...counterpartsOffer,
    },
  ].filter(x => x);
};

const insertOffer = (values) => {
  const offers = mapValuesToOffer({ ...values });
  return Promise.all(offers.map(offer => offerInsert.run({ offer })));
};

export default compose(
  withSmartQuery({
    query: loanLenders,
    params: ({ loanId }) => ({ loanId }),
    queryOptions: { reactive: false },
    dataName: 'lenders',
    smallLoader: true,
  }),
  withProps(({ lenders }) => ({ schema: schema(lenders), insertOffer })),
);
