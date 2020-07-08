import React from 'react';

import IconButton from 'core/components/IconButton';
import InputAdornment from 'core/components/Material/InputAdornment';
import Slider from 'core/components/Material/Slider';
import TextField from 'core/components/Material/TextField';
import T from 'core/components/Translation/FormattedMessage';

import { useWwwCalculator } from '../WwwCalculatorState';

const WwwCalculatorFormField = ({ field }) => {
  const [{ purchaseType, ...state }] = useWwwCalculator();
  const { value, sliderMax } = state[field];

  return (
    <div className="mb-32">
      <TextField
        id={field}
        value={value}
        type="tel"
        size="med"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <T
                id={`WwwCalculatorFormField.${field}`}
                values={{ purchaseType }}
              />
            </InputAdornment>
          ),
        }}
        fullWidth
        className="mb-8"
      />
      <div className="flex nowrap pl-8 ">
        <Slider value={value} className="mr-16" />
        <IconButton type="add" size="small" />
      </div>
    </div>
  );
};

export default WwwCalculatorFormField;
