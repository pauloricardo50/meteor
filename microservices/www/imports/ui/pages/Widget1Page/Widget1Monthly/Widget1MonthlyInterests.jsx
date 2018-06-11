import React from 'react';
import PropTypes from 'prop-types';
import { lifecycle } from 'recompose';

import Select from 'core/components/Select';
import T, { Percent } from 'core/components/Translation';
import { INTEREST_RATES } from 'core/api/constants';
import interestRates from '../../InterestsPage/interestRates';

const displayedRates = [
  INTEREST_RATES.LIBOR,
  INTEREST_RATES.YEARS_5,
  INTEREST_RATES.YEARS_10,
  INTEREST_RATES.YEARS_20,
];

const options = interestRates
  .filter(({ type }) => displayedRates.indexOf(type) > -1)
  .map(({ type, rateLow, rateHigh }) => {
    const averageRate = (rateHigh + rateLow) / 2;
    return {
      type,
      id: averageRate,
      label: (
        <span>
          <T
            id="Widget1MonthlyInterests.optionLabel"
            values={{
              type: <T id={`InterestsTable.${type}`} />,
              rate: <Percent value={averageRate} />,
            }}
          />
        </span>
      ),
    };
  });

const Widget1MonthlyInterests = ({ value, onChange }) => (
  <Select
    label={<T id="Widget1MonthlyInterests.label" />}
    value={value}
    onChange={(_, val) => onChange(val)}
    options={options}
    className="widget1-montly-interests"
  />
);

Widget1MonthlyInterests.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

// Set the initial value of the dropdown, do this here to allow custom interest
// rates
export default lifecycle({
  componentDidMount() {
    const initialRate = options.find(rate => rate.type === INTEREST_RATES.YEARS_10).id;
    this.props.onChange(initialRate);
  },
})(Widget1MonthlyInterests);
