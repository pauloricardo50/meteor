import { compose, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { offerInsert } from '../../api';
import { withSmartQuery } from '../../api/containerToolkit';
import { INTEREST_RATES } from '../../api/interestRates/interestRatesConstants';
import { loanLenders } from '../../api/lenders/queries';
import { CUSTOM_AUTOFIELD_TYPES } from '../AutoForm2/autoFormConstants';

const interestRatesSchema = ({ isDiscount }) =>
  Object.values(INTEREST_RATES).reduce(
    (types, type) => ({
      ...types,
      [`${isDiscount ? 'discount_' : ''}${type}`]: {
        type: Number,
        min: 0,
        max: 1,
        uniforms: {
          type: CUSTOM_AUTOFIELD_TYPES.PERCENT,
          placeholder: null,
          fullWidth: false,
          style: { width: 100, marginRight: 4 },
        },
        optional: true,
        condition: ({ hasCounterparts, hasFlatDiscount }) =>
          isDiscount ? hasCounterparts && !hasFlatDiscount : true,
      },
    }),
    {},
  );

const schema = lenders =>
  new SimpleSchema({
    withCounterparts: {
      type: Boolean,
      optional: true,
      defaultValue: false,
    },
    lender: {
      type: String,
      optional: false,
      defaultValue: null,
      allowedValues: lenders.map(({ _id }) => _id),
      uniforms: {
        transform: lenderId => {
          const { organisation, contact } =
            lenders.find(({ _id }) => lenderId === _id) || {};
          const { name: organisationName } = organisation || {};
          const { name: contactName } = contact || {};
          return contactName
            ? `${organisationName} (${contactName})`
            : organisationName;
        },
        placeholder: 'Aucun',
        labelProps: { shrink: true },
      },
    },
    maxAmount: {
      type: SimpleSchema.Integer,
      min: 0,
      max: 100000000,
      optional: false,
      uniforms: {
        type: CUSTOM_AUTOFIELD_TYPES.MONEY,
      },
    },
    fees: {
      type: Number,
      min: 0,
      max: 100000000,
      defaultValue: 0,
      optional: true,
      uniforms: {
        type: CUSTOM_AUTOFIELD_TYPES.MONEY,
      },
    },
    epotekFees: {
      type: Number,
      min: 0,
      max: 100000000,
      defaultValue: 0,
      optional: true,
      uniforms: {
        type: CUSTOM_AUTOFIELD_TYPES.MONEY,
      },
    },
    amortizationGoal: {
      type: Number,
      min: 0,
      max: 1,
      uniforms: { type: CUSTOM_AUTOFIELD_TYPES.PERCENT, placeholder: null },
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
      condition: ({ withCounterparts }) => !withCounterparts,
    },
    counterparts: {
      type: Array,
      optional: true,
      defaultValue: [],
      condition: ({ hasCounterparts, withCounterparts }) =>
        !withCounterparts && hasCounterparts,
    },
    'counterparts.$': {
      type: String,
      optional: true,
    },
    hasFlatDiscount: {
      type: Boolean,
      defaultValue: true,
      optional: true,
      condition: ({ hasCounterparts, withCounterparts }) =>
        !withCounterparts && hasCounterparts,
    },
    flatDiscount: {
      type: Number,
      min: 0,
      max: 1,
      uniforms: { type: CUSTOM_AUTOFIELD_TYPES.PERCENT },
      optional: true,
      condition: ({ hasCounterparts, withCounterparts, hasFlatDiscount }) =>
        !withCounterparts && hasCounterparts && hasFlatDiscount,
    },
    ...interestRatesSchema({ isDiscount: true }),
    enableOffer: { type: Boolean, defaultValue: true, optional: true },
  });

const isStandardRatesKeys = key => !key.includes('discount_');
const isDiscountRatesKeys = key => !isStandardRatesKeys(key);

const filterRates = ({ isCounterPartOffer, hasFlatDiscount }) => key => {
  if (isCounterPartOffer) {
    return hasFlatDiscount
      ? isStandardRatesKeys(key)
      : isDiscountRatesKeys(key);
  }
  return isStandardRatesKeys(key);
};

const reformatInterestRatesObject = ({
  interestRates,
  isCounterPartOffer,
  hasFlatDiscount,
  flatDiscount,
}) =>
  Object.keys(interestRates)
    .filter(filterRates({ isCounterPartOffer, hasFlatDiscount }))
    .reduce((rates, key) => {
      const interestRateType = isDiscountRatesKeys(key)
        ? key.split('discount_')[1]
        : key;
      return {
        ...rates,
        [interestRateType]: hasFlatDiscount
          ? interestRates[interestRateType] - flatDiscount
          : interestRates[key],
      };
    }, {});

const mapValuesToOffer = ({
  withCounterparts,
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
  enableOffer,
  ...interestRates
}) => {
  const standardOffer = {
    withCounterparts,
    maxAmount,
    amortizationGoal,
    amortizationYears,
    enableOffer,
    ...reformatInterestRatesObject({
      interestRates,
      isCounterPartOffer: false,
    }),
  };

  const counterpartsOffer =
    !withCounterparts && hasCounterparts
      ? {
          withCounterparts: true,
          maxAmount,
          amortizationGoal,
          amortizationYears,
          enableOffer,
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
    !withCounterparts &&
      hasCounterparts && {
        lenderId,
        conditions: [...conditions, ...counterparts].filter(x => x),
        fees,
        epotekFees,
        ...counterpartsOffer,
      },
  ].filter(x => x);
};

const insertOffer = values => {
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
