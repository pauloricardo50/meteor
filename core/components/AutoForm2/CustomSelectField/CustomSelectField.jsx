import React, { useMemo, useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import { compose } from 'recompose';
import { connectField, filterDOMProps } from 'uniforms';
import { wrapField } from 'uniforms-material';

import { ignoreProps } from '../../../containers/updateForProps';
import Checkbox from '../../Material/Checkbox';
import MenuItem from '../../Material/MenuItem';
import Radio, { RadioGroup } from '../../Material/Radio';
import Switch from '../../Material/Switch';
import TextField from '../../Material/TextField';
import { mapSelectOptions } from '../../Select/selectHelpers';
import TextInput from '../../TextInput';
import { OTHER_ALLOWED_VALUE } from '../autoFormConstants';
import CustomSelectFieldContainer from './CustomSelectFieldContainer';

const xor = (item, array) => {
  const index = array.indexOf(item);

  if (index === -1) {
    return array.concat([item]);
  }

  return array.slice(0, index).concat(array.slice(index + 1));
};

const renderSelect = ({
  InputLabelProps,
  allowedValues,
  disabled,
  error,
  errorMessage,
  fieldType,
  fullWidth,
  helperText,
  id,
  inputProps,
  label,
  labelProps,
  margin,
  name,
  native,
  onChange,
  placeholder,
  required,
  showInlineError,
  transform,
  value,
  variant,
  nullable,
  grouping,
  data = [],
  ...props
}) => {
  const hasPlaceholder = !!placeholder;
  const hasValue = value !== '' && value !== undefined;

  const options = useMemo(
    () =>
      allowedValues.map(v => {
        // Make this data available for grouping
        const rest = data?.filter(x => x?._id).find(({ _id }) => _id === v);
        return { id: v, label: transform(v), ...rest };
      }),
    [allowedValues],
  );

  return (
    <TextField
      disabled={!!disabled}
      error={!!error}
      fullWidth={fullWidth}
      helperText={(error && showInlineError && errorMessage) || helperText}
      InputLabelProps={{
        shrink: !!label && (hasPlaceholder || hasValue),
        ...labelProps,
        ...InputLabelProps,
      }}
      label={label}
      margin={margin}
      onChange={event => disabled || onChange(event.target.value)}
      required={required}
      select
      SelectProps={{
        displayEmpty: hasPlaceholder,
        inputProps: { name, ...inputProps },
        multiple: fieldType === Array || undefined,
        native,
        ...filterDOMProps(props),
      }}
      value={native && !value ? '' : value}
      id={id}
    >
      {hasPlaceholder && (
        <MenuItem value="" disabled={nullable}>
          <i className="secondary">{placeholder}</i>
        </MenuItem>
      )}
      {mapSelectOptions(options, grouping)}
    </TextField>
  );
};

const renderCheckboxes = ({
  allowedValues,
  appearance,
  disabled,
  error,
  errorMessage,
  fieldType,
  id,
  inputRef,
  label,
  legend,
  name,
  onChange,
  showInlineError,
  transform,
  value,
  nullable,
  ...props
}) => {
  let children;
  const filteredProps = wrapField._filterDOMProps(filterDOMProps(props));

  const allValues = nullable ? [undefined, ...allowedValues] : allowedValues;

  if (fieldType !== Array) {
    children = (
      <RadioGroup
        id={id}
        name={name}
        onChange={event => disabled || onChange(event.target.value)}
        ref={inputRef}
        value={value}
      >
        {allValues.map(item => (
          <FormControlLabel
            control={<Radio id={`${id}-${item}`} {...filteredProps} />}
            key={item}
            label={transform ? transform(item) : item}
            value={item}
          />
        ))}
      </RadioGroup>
    );
  } else {
    const SelectionControl = appearance === 'checkbox' ? Checkbox : Switch;

    children = (
      <FormGroup id={id}>
        {allValues.map(item => (
          <FormControlLabel
            control={
              <SelectionControl
                checked={value.includes(item)}
                id={`${id}-${item}`}
                name={name}
                onChange={() => disabled || onChange(xor(item, value))}
                ref={inputRef}
                value={props.name}
                {...filteredProps}
              />
            }
            key={item}
            label={transform ? transform(item) : item}
          />
        ))}
      </FormGroup>
    );
  }

  return wrapField(
    {
      ...props,
      component: 'fieldset',
      disabled,
      error,
      errorMessage,
      showInlineError,
    },
    (legend || label) && (
      <FormLabel component="legend">{legend || label}</FormLabel>
    ),
    children,
  );
};

const Select = ({ checkboxes, ...props }) =>
  checkboxes ? renderCheckboxes(props) : renderSelect(props);

Select.defaultProps = {
  appearance: 'checkbox',
  fullWidth: true,
  margin: 'dense',
};

const SelectField = connectField(Select);

const CustomSelectField = ({
  transform,
  values = [],
  renderValue,
  withCustomOther,
  value,
  onChange,
  ...props
}) => {
  const isCustomOther = withCustomOther && !values.includes(value);
  const [customOther, setCustomOther] = useState(
    isCustomOther ? value : undefined,
  );
  const [displayCustomOther, setDisplayCustomOther] = useState(isCustomOther);

  return (
    <>
      <SelectField
        {...props}
        value={customOther ? OTHER_ALLOWED_VALUE : value}
        allowedValues={values}
        transform={transform}
        renderValue={renderValue}
        labelProps={{ shrink: true }}
        onChange={(val, key) => {
          if (withCustomOther && val === OTHER_ALLOWED_VALUE) {
            setDisplayCustomOther(true);
            return onChange(customOther || val, key);
          }
          setCustomOther();
          setDisplayCustomOther(false);
          return onChange(val, key);
        }}
      />
      {withCustomOther && displayCustomOther && (
        <>
          <TextInput
            value={customOther}
            onChange={val => {
              setCustomOther(val);
              onChange(val, props.key);
            }}
            label="Préciser"
            className="mb-8"
            id={`${props.id}-specify`}
          />
        </>
      )}
    </>
  );
};

export default compose(
  CustomSelectFieldContainer,
  React.memo,
  ignoreProps(['label', 'InputLabelProps', 'onChange', 'changedMap']),
)(CustomSelectField);
