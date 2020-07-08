import React from 'react';

import MenuItem from 'core/components/Material/MenuItem';
import TextField from 'core/components/Material/TextField';
import T from 'core/components/Translation/FormattedMessage';
import Percent from 'core/components/Translation/numberComponents/Percent';

import { ACTIONS } from './wwwCalculatorConstants';
import { useWwwCalculator } from './WwwCalculatorState';

const WwwCalculatorChartForm = () => {
  const [{ interestRates, interestRate }, dispatch] = useWwwCalculator();

  return (
    <div>
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
    </div>
  );
};

export default WwwCalculatorChartForm;
