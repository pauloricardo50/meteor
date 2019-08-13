import React from 'react';
import PropTypes from 'prop-types';
import { lifecycle } from 'recompose';

import Select from 'core/components/Select';
import T, { Percent } from 'core/components/Translation';
import { INTEREST_RATES } from 'core/api/constants';

const displayedRates = [
  INTEREST_RATES.LIBOR,
  INTEREST_RATES.YEARS_5,
  INTEREST_RATES.YEARS_10,
  INTEREST_RATES.YEARS_20,
];

const options = interestRates =>
  interestRates
    .filter(({ type }) => displayedRates.indexOf(type) > -1)
    .map(({ type, rateLow, rateHigh }) => {
      const averageRate = (rateHigh + rateLow) / 2;
      return {
        type,
        id: averageRate,
        label: (
          <T
            id="Widget1MonthlyInterests.optionLabel"
            values={{
              type: <T id={`InterestsTable.${type}`} />,
              rate: <Percent value={averageRate} />,
            }}
          />
        ),
      };
    });

const Widget1MonthlyInterests = ({ value, onChange, interestRates }) => (
  <Select
    label={<T id="Widget1MonthlyInterests.label" />}
    value={value}
    onChange={(_, val) => onChange(val)}
    options={options(interestRates)}
    className="widget1-montly-interests"
  />
);

Widget1MonthlyInterests.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

// Set the initial value of the dropdown, do this here to allow custom interest
// rates
export default lifecycle({
  componentDidMount() {
    const initialRate = options(this.props.interestRates).find(rate => rate.type === INTEREST_RATES.YEARS_10).id;
    this.props.onChange(initialRate);
  },
})(Widget1MonthlyInterests);
