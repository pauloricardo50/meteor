import React, { useRef } from 'react';
import { animated, useSpring } from 'react-spring';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import IconButton from 'core/components/IconButton';
import InputAdornment from 'core/components/Material/InputAdornment';
import Slider from 'core/components/Material/Slider';
import TextField from 'core/components/Material/TextField';
import T from 'core/components/Translation/FormattedMessage';
import useMedia from 'core/hooks/useMedia';
import { toNumber } from 'core/utils/conversionFunctions';
import { numberMask } from 'core/utils/textMasks';

import { ACTIONS } from '../wwwCalculatorConstants';
import { useWwwCalculator } from '../WwwCalculatorState';

const textMask = createNumberMask({
  ...numberMask,
  prefix: 'CHF ',
});

const normalizeValue = value => value || 0;

const WwwCalculatorFormFieldContainer = ({ field, error }) => {
  const [{ purchaseType, ...state }, dispatch] = useWwwCalculator();
  const { value = 0, sliderMax, isAuto } = state[field];
  const normalizedValue = normalizeValue(value);
  const animatedValue = useSpring({
    value: normalizedValue,
    config: { precision: 100, mass: 1, tension: 250, friction: 40 },
  });

  const handleChange = newValue => {
    dispatch({
      type: ACTIONS.SET_VALUE,
      payload: { value: toNumber(newValue), at: field },
    });
  };

  return (
    <WwwCalculatorFormField
      value={isAuto ? animatedValue.value : value}
      handleChange={handleChange}
      sliderMax={sliderMax}
      purchaseType={purchaseType}
      field={field}
      increaseSliderMax={() =>
        dispatch({
          type: ACTIONS.SET_AT,
          payload: { at: field, sliderMax: Math.min(sliderMax * 2, 1e8) },
        })
      }
      error={error}
    />
  );
};

const WwwCalculatorFormField = animated(
  ({
    value,
    handleChange,
    field,
    purchaseType,
    sliderMax,
    increaseSliderMax,
    error,
  }) => {
    const rounded = Math.round(value);
    const ref = useRef(null);
    const isMobile = useMedia({ maxWidth: 768 });

    return (
      <div className="mb-16 animated fadeIn">
        <TextField
          id={field}
          value={rounded}
          onChange={e => handleChange(e.target.value)}
          type="tel"
          size={isMobile ? 'small' : 'med'}
          InputProps={{
            inputComponent: MaskedInput,
            inputProps: {
              mask: textMask,
              render: (r, props) => (
                <input
                  ref={node => {
                    r(node);
                    ref.current = node;
                  }}
                  {...props}
                />
              ),
            },
            startAdornment: (
              <InputAdornment
                position="start"
                onClick={() => ref.current?.focus()}
              >
                <T
                  id={`WwwCalculatorFormField.${field}`}
                  values={{ purchaseType }}
                />
              </InputAdornment>
            ),
          }}
          fullWidth
          aria-label={
            <T
              id={`WwwCalculatorFormField.${field}`}
              values={{ purchaseType }}
            />
          }
          error={error}
        />

        <div className="flex nowrap center-align pl-8 ">
          <Slider
            value={rounded}
            onChange={(e, v) => handleChange(v)}
            className="mr-16"
            min={0}
            max={sliderMax}
            step={5000}
          />
          {rounded >= sliderMax * 0.9 ? (
            <IconButton
              type="add"
              size="small"
              tooltip={<T id="WwwCalculatorFormField.increaseSliderMax" />}
              className="animated fadeIn"
              onClick={increaseSliderMax}
              style={{ flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: 28.25, height: 28.25, flexShrink: 0 }} />
          )}
        </div>
      </div>
    );
  },
);

export default WwwCalculatorFormFieldContainer;
