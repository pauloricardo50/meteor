import React from 'react';
import { compose, withProps, withState } from 'recompose';
import SimpleSchema from 'simpl-schema';

import {
  INTEREST_RATES,
  TRENDS,
} from 'core/api/interestRates/interestRatesConstants';
import {
  interestRatesInsert,
  interestRatesRemove,
  interestRatesUpdate,
} from 'core/api/interestRates/methodDefinitions';
import { CustomAutoField } from 'core/components/AutoForm2/AutoFormComponents';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/autoFormConstants';
import InterestsTableTrend from 'core/components/InterestRatesTable/InterestsTableTrend';
import T from 'core/components/Translation';
import Percent from 'core/components/Translation/numberComponents/Percent';

const singleInterestRate = type => ({
  [type]: { type: Object, optional: true },
  [`${type}.rateLow`]: {
    type: Number,
    min: 0,
    max: 1,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.PERCENT, placeholder: '0.00%' },
    optional: true,
  },
  [`${type}.rateHigh`]: {
    type: Number,
    min: 0,
    max: 1,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.PERCENT, placeholder: '0.00%' },
    optional: true,
  },
  [`${type}.trend`]: {
    type: String,
    allowedValues: Object.values(TRENDS),
    optional: true,
    uniforms: { displayEmpty: false, placeholder: '' },
  },
});

const rates = Object.values(INTEREST_RATES).reduce(
  (interestRates, type) => ({
    ...interestRates,
    ...singleInterestRate(type),
  }),
  {},
);

const interestRatesSchema = new SimpleSchema({
  date: {
    type: Date,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  ...rates,
});

const renderCurrentRates = ({ rateLow, rateHigh, trend }) => (
  <div className="current-rates">
    <h4>Taux en cours</h4>
    <table>
      <tr>
        <td>
          <Percent value={rateLow} />
        </td>
        <td>-</td>
        <td>
          <Percent value={rateHigh} />
        </td>
        <td>
          <InterestsTableTrend trend={trend} />
        </td>
      </tr>
    </table>
  </div>
);

const singleInterestRateField = ({ type, currentInterestRates }) => {
  const currentRates = currentInterestRates.find(
    ({ type: rateType }) => type === rateType,
  );
  return (
    <div className="single-interest-rate-field">
      <div className="single-interest-rate-field-title">
        <h3>
          <T id={`InterestsTable.${type}`} />
        </h3>
        {currentRates && renderCurrentRates(currentRates)}
      </div>
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
    </div>
  );
};
const fields = currentInterestRates => [
  <CustomAutoField name="date" key="date" />,
  ...Object.values(INTEREST_RATES).map(type =>
    singleInterestRateField({ type, currentInterestRates }),
  ),
];

export default compose(
  withState('submitting', 'setSubmitting', false),
  withProps(({ setOpen, setSubmitting, currentInterestRates = [] }) => ({
    schema: interestRatesSchema,
    fields: fields(currentInterestRates),
    insertInterestRates: data =>
      interestRatesInsert.run({ interestRates: data }),
    modifyInterestRates: data => {
      const { _id: interestRatesId, ...object } = data;
      setSubmitting(true);
      return interestRatesUpdate
        .run({ interestRatesId, object })
        .then(() => setOpen(false))
        .finally(() => setSubmitting(false));
    },
    removeInterestRates: interestRatesId => {
      setSubmitting(true);
      return interestRatesRemove
        .run({ interestRatesId })
        .then(() => setOpen(false))
        .finally(() => setSubmitting(false));
    },
  })),
);
