import SimpleSchema from 'simpl-schema';
import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api';
import { PercentField } from 'imports/core/components/PercentInput/';
import loanLenders from '../../api/lenders/queries/loanLenders';
import { INTEREST_RATES } from '../../api/constants';
import { offerInsert } from '../../api';

SimpleSchema.extendOptions(['condition', 'customAllowedValues']);

const interestRatesSchema = ({ isDiscount }) =>
  Object.values(INTEREST_RATES).reduce(
    (types, type) => ({
      ...types,
      [`${type}${isDiscount ? 'Discount' : ''}`]: {
        type: Number,
        min: 0,
        max: 1,
        uniforms: { component: PercentField },
        optional: true,
        condition: ({ hasCounterParts, hasFlatDiscount }) =>
          (isDiscount ? hasCounterParts && !hasFlatDiscount : true),
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
      uniforms: { component: PercentField },
      optional: false,
    },
    amortizationYears: {
      type: SimpleSchema.Integer,
      min: 0,
      max: 100,
      optional: true,
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
    hasCounterParts: {
      type: Boolean,
      defaultValue: false,
      optional: true,
    },
    counterParts: {
      type: Array,
      optional: true,
      defaultValue: [],
      condition: ({ hasCounterParts }) => hasCounterParts,
    },
    'counterParts.$': {
      type: String,
      optional: true,
    },
    hasFlatDiscount: {
      type: Boolean,
      defaultValue: true,
      optional: true,
      condition: ({ hasCounterParts }) => hasCounterParts,
    },
    flatDiscount: {
      type: Number,
      min: 0,
      max: 1,
      uniforms: { component: PercentField },
      optional: true,
      condition: ({ hasCounterParts, hasFlatDiscount }) =>
        hasCounterParts && hasFlatDiscount,
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
  hasCounterParts,
  counterParts = [],
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

  const counterPartsOffer = hasCounterParts
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
    hasCounterParts && {
      lenderId,
      conditions: [...conditions, ...counterParts].filter(x => x),
      fees,
      epotekFees,
      ...counterPartsOffer,
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
