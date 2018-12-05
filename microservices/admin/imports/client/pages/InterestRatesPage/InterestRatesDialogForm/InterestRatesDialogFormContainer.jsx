import React from 'react';
import SimpleSchema from 'simpl-schema';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import {
  TRENDS,
  INTEREST_RATES,
} from 'core/api/interestRates/interestRatesConstants';
import { withProps, compose, withState } from 'recompose';
import {
  interestRatesInsert,
  interestRatesUpdate,
  interestRatesRemove,
} from 'imports/core/api/methods/index';
import { PercentField } from 'imports/core/components/PercentInput/';
import { CustomAutoField } from 'imports/core/components/AutoForm2/AutoFormComponents';
import T from 'imports/core/components/Translation';

const singleInterestRate = type => ({
  [type]: { type: Object, optional: true },
  [`${type}.rateLow`]: {
    type: Number,
    min: 0,
    max: 1,
    uniforms: { component: PercentField },
    optional: true,
  },
  [`${type}.rateHigh`]: {
    type: Number,
    min: 0,
    max: 1,
    uniforms: { component: PercentField },
    optional: true,
  },
  [`${type}.trend`]: {
    type: String,
    allowedValues: Object.values(TRENDS),
    optional: true,
  },
});

const rates = Object.values(INTEREST_RATES).reduce(
  (interestRates, type) => ({ ...interestRates, ...singleInterestRate(type) }),
  {},
);

const interestRatesSchema = new SimpleSchema({
  date: {
    type: Date,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  ...rates,
});

const singleInterestRateField = type => (
  <>
    <h3>
      <T id={`InterestsTable.${type}`} />
    </h3>
    <div className="interest-rates-dialog-form" key={type}>
      <CustomAutoField
        name={`${type}.rateLow`}
        overrideLabel={<T id="InterestsTable.rateLow" />}
      />
      <CustomAutoField
        name={`${type}.rateHigh`}
        overrideLabel={<T id="InterestsTable.rateHigh" />}
      />
      <CustomAutoField
        name={`${type}.trend`}
        overrideLabel={<T id="InterestsTable.trend" />}
        intlId="trend"
      />
    </div>
  </>
);

const fields = [
  <CustomAutoField name="date" key="date" />,
  ...Object.values(INTEREST_RATES).map(singleInterestRateField),
];

export default compose(
  withState('submitting', 'setSubmitting', false),
  withProps(({ setOpen, setSubmitting }) => ({
    schema: interestRatesSchema,
    fields,
    insertInterestRates: data =>
      interestRatesInsert.run({ interestRates: data }),
    modifyInterestRates: (data) => {
      const { _id: interestRatesId, ...object } = data;
      setSubmitting(true);
      return interestRatesUpdate
        .run({ interestRatesId, object })
        .then(() => setOpen(false))
        .finally(() => setSubmitting(false));
    },
    removeInterestRates: (interestRatesId) => {
      setSubmitting(true);
      return interestRatesRemove
        .run({ interestRatesId })
        .then(() => setOpen(false))
        .finally(() => setSubmitting(false));
    },
  })),
);
