import React from 'react';

import MenuItem from 'core/components/Material/MenuItem';
import TextField from 'core/components/Material/TextField';
import Toggle from 'core/components/Toggle';
import T from 'core/components/Translation/FormattedMessage';
import Percent from 'core/components/Translation/numberComponents/Percent';

import { ACTIONS } from './wwwCalculatorConstants';
import { useWwwCalculator } from './WwwCalculatorState';

const WwwCalculatorChartForm = () => {
  const [
    { interestRates, interestRate, includeMaintenance },
    dispatch,
  ] = useWwwCalculator();

  return (
    <div className="www-calculator-chart-form mt-16">
      <TextField
        label={<T id="WwwCalculatorChartForm.interests" />}
        select
        value={interestRate}
        onChange={e =>
          dispatch({
            type: ACTIONS.SET_VALUE,
            payload: { interestRate: e.target.value },
          })
        }
        size="med"
        fullWidth
        className="mb-16"
      >
        {interestRates.map(({ rateLow, type }) => (
          <MenuItem key={type} value={rateLow} dense={false}>
            <T id={`WwwCalculatorChartForm.${type}`} />
            :&nbsp;
            <b>
              <Percent value={rateLow} />
            </b>
          </MenuItem>
        ))}
      </TextField>

      <Toggle
        labelLeft={<T id="WwwCalculatorChartForm.includeMaintenance" />}
        toggled={includeMaintenance}
        onToggle={checked =>
          dispatch({
            type: ACTIONS.SET_VALUE,
            payload: { includeMaintenance: checked },
          })
        }
        size="med"
      />
    </div>
  );
};

export default WwwCalculatorChartForm;
