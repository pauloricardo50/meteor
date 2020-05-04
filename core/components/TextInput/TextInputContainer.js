import moment from 'moment';
import { injectIntl } from 'react-intl';
import MaskedInput from 'react-text-mask';
import { compose, mapProps } from 'recompose';

import {
  toDecimalNumber,
  toNegativeNumber,
  toNumber,
} from '../../utils/conversionFunctions';
import {
  percentMask,
  swissFrancDecimalNegativeMask,
  swissFrancMask,
  swissFrancMaskDecimal,
  swissFrancNegativeMask,
} from '../../utils/textMasks';

const getDefaults = ({
  type,
  id,
  onChange,
  value,
  simpleOnChange,
  negative,
  decimal,
}) => {
  if (simpleOnChange) {
    return { onChangeHandler: onChange, value };
  }

  switch (type) {
    case 'money': {
      let mask;
      let conversionFunction;
      if (decimal) {
        conversionFunction = toDecimalNumber;
        if (negative) {
          mask = swissFrancDecimalNegativeMask;
        } else {
          mask = swissFrancMaskDecimal;
        }
      } else if (negative) {
        mask = swissFrancNegativeMask;
        conversionFunction = toNegativeNumber;
      } else {
        mask = swissFrancMask;
        conversionFunction = toNumber;
      }
      return {
        onChangeHandler: event =>
          onChange(conversionFunction(event.target.value), id, event),
        showMask: true,
        mask,
        placeholder: 0,
        value,
      };
    }
    case 'percent':
      return {
        onChangeHandler: event =>
          onChange(
            Math.round(parseFloat(event.target.value) * 100) / 10000,
            id,
            event,
          ),
        showMask: true,
        mask: percentMask,
        placeholder: '%',
        value: (value * 100).toFixed(2),
      };
    case 'number':
      return {
        onChangeHandler: event =>
          onChange(toNumber(event.target.value), id, event),
        showMask: false,
        value,
      };
    case 'date':
      return {
        onChangeHandler: event => onChange(event.target.value, id, event),
        onDateChange: val => {
          // This specific format should be used for the server to get the
          // date in the right order
          const date = moment(val).format('YYYY-MM-DD');
          // Allow setting a date to null
          onChange(val ? date : null, id, {});
        },
        showMask: false,
        value: value ? moment(value) : null,
      };
    default:
      return {
        // Pass event as third argument, for some components which need it
        // like react-autosuggest
        onChangeHandler: event => onChange(event.target.value, id, event),
        showMask: false,
        value,
      };
  }
};

export const getFinalPlaceholder = ({
  noIntl,
  placeholder,
  defaultPlaceholder,
  intl,
  type,
}) => {
  let finalPlaceholder;
  if (noIntl) {
    finalPlaceholder = placeholder || defaultPlaceholder;
  } else {
    finalPlaceholder =
      placeholder && typeof placeholder === 'string'
        ? `${intl.formatMessage({
            id: 'Forms.textInput.placeholderPrefix',
          })} ${intl.formatMessage({ id: placeholder })}`
        : defaultPlaceholder;
  }

  // Ignore placeholder for money inputs, and just show the currency
  // Showing an amount is confusing
  if (type === 'money') {
    finalPlaceholder = defaultPlaceholder;
  }

  return finalPlaceholder;
};

const TextInputContainer = compose(
  injectIntl,
  mapProps(
    ({
      decimal,
      id,
      inputComponent,
      inputProps,
      InputProps = {},
      inputType,
      intl,
      negative,
      noIntl,
      onChange,
      placeholder,
      simpleOnChange,
      type,
      value,
      ...rest
    }) => {
      const {
        onChangeHandler,
        onDateChange,
        showMask,
        mask,
        placeholder: defaultPlaceholder,
        value: formattedValue,
      } = getDefaults({
        type,
        id,
        onChange,
        value,
        simpleOnChange,
        negative,
        decimal,
      });

      return {
        id,
        onChange: onChangeHandler,
        placeholder: getFinalPlaceholder({
          noIntl,
          placeholder,
          defaultPlaceholder,
          intl,
          type,
        }),
        value: formattedValue,
        InputProps: {
          inputComponent: showMask ? MaskedInput : inputComponent || undefined,
          ...InputProps,
          inputProps: {
            pattern: mask ? '[0-9]*' : undefined,
            onDateChange: type === 'date' ? onDateChange : undefined,
            mask: mask || undefined,
            ...InputProps.inputProps,
            ...inputProps,
          },
        },
        type: inputType,
        dataType: type,
        ...rest,
      };
    },
  ),
);

export default TextInputContainer;
