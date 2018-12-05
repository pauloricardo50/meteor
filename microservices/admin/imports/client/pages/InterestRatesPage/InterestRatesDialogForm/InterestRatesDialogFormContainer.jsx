import React from 'react';
import SimpleSchema from 'simpl-schema';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import {
  TRENDS,
  INTEREST_RATES,
} from 'core/api/interestRates/interestRatesConstants';
import { withProps } from 'recompose';
import { interestRatesInsert } from 'imports/core/api/methods/index';
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
    <h3>{type}</h3>
    <div className="interest-rates-dialog-form" key={type}>
      <CustomAutoField
        name={`${type}.rateLow`}
        overrideLabel={<T id="Forms.rateLow" />}
      />
      <CustomAutoField
        name={`${type}.rateHigh`}
        overrideLabel={<T id="Forms.rateHigh" />}
      />
      <CustomAutoField
        name={`${type}.trend`}
        overrideLabel={<T id="Forms.trend" />}
      />
    </div>
  </>
);

const fields = [
  <CustomAutoField name="date" key="date" />,
  ...Object.values(INTEREST_RATES).map(singleInterestRateField),
];

export default withProps(() => ({
  schema: interestRatesSchema,
  fields,
  insertInterestRates: data => interestRatesInsert.run({ interestRates: data }),
}));
