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
} from 'core/api/methods/index';
import { PercentField } from 'core/components/PercentInput/';
import { CustomAutoField } from 'core/components/AutoForm2/AutoFormComponents';
import T from 'core/components/Translation';
import Percent from 'core/components/Translation/numberComponents/Percent';
import InterestsTableTrend from 'core/components/InterestRatesTable/InterestsTableTrend';

const TRESHOLD = 0.001;

const getAverage = (values = []) => {
  const filteredValues = !!values.length && values.filter(x => !!x);
  return (
    filteredValues.reduce(
      (sum, x) => sum + x,
      filteredValues.length > 1 ? 0 : undefined,
    ) / filteredValues.length
  );
};

const getNewTrend = ({ trend, diff }) => {
  let newTrend = trend;

  if (!!diff && !newTrend) {
    if (diff < -TRESHOLD) {
      newTrend = TRENDS.DOWN;
    } else if (diff > TRESHOLD) {
      newTrend = TRENDS.UP;
    } else {
      newTrend = TRENDS.FLAT;
    }
  }

  return newTrend;
};

const getTrend = ({ model, type, currentInterestRates }) => {
  const { rateLow, rateHigh, trend } = model[type] || {};
  const { rateLow: currentRateLow, rateHigh: currentRateHigh } = currentInterestRates.find(({ type: rateType }) => rateType === type) || {};

  const average = getAverage([rateLow, rateHigh]);
  const currentAverage = getAverage([currentRateLow, currentRateHigh]);

  const diff = average - currentAverage;

  return getNewTrend({ trend, diff });
};

const singleInterestRate = ({ type, currentInterestRates }) => ({
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
    uniforms: { displayEmpty: false, placeholder: '' },
    customAutoValue: model => getTrend({ model, type, currentInterestRates }),
  },
});

const rates = ({ currentInterestRates }) =>
  Object.values(INTEREST_RATES).reduce(
    (interestRates, type) => ({
      ...interestRates,
      ...singleInterestRate({ type, currentInterestRates }),
    }),
    {},
  );

const interestRatesSchema = ({ currentInterestRates }) =>
  new SimpleSchema({
    date: {
      type: Date,
      uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
    },
    ...rates({ currentInterestRates }),
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
  const currentRates = currentInterestRates.find(({ type: rateType }) => type === rateType);
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
    singleInterestRateField({ type, currentInterestRates })),
];

export default compose(
  withState('submitting', 'setSubmitting', false),
  withProps(({
    setOpen,
    setSubmitting,
    currentInterestRates = [],
  }) => ({
    schema: interestRatesSchema({ currentInterestRates }),
    fields: fields(currentInterestRates),
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
