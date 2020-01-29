// @flow
import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { filterDOMProps, connectField } from 'uniforms';
import { wrapField } from 'uniforms-material';
import { compose } from 'recompose';

import CustomSelectFieldContainer from './CustomSelectFieldContainer';
import { ignoreProps } from '../../containers/updateForProps';
import { OTHER_ALLOWED_VALUE } from './constants';
import TextInput from '../TextInput/TextInput';

type CustomSelectFieldProps = {
  transform: Function,
  allowedValues: Array,
  customAllowedValues: Function,
  model: Object,
};

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
  ...props
}) => {
  const Item = native ? 'option' : MenuItem;
  const hasPlaceholder = !!placeholder;
  const hasValue = value !== '' && value !== undefined;

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
        inputProps: { name, id, ...inputProps },
        multiple: fieldType === Array || undefined,
        native,
        ...filterDOMProps(props),
      }}
      value={native && !value ? '' : value}
      variant={variant}
    >
      {hasPlaceholder && (
        <Item value="" disabled>
          <i>{placeholder}</i>
        </Item>
      )}
      {allowedValues.map(value => (
        <Item key={value} value={value}>
          {transform ? transform(value) : value}
        </Item>
      ))}
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
  ...props
}) => {
  let children;
  const filteredProps = wrapField._filterDOMProps(filterDOMProps(props));

  if (fieldType !== Array) {
    children = (
      <RadioGroup
        id={id}
        name={name}
        onChange={event => disabled || onChange(event.target.value)}
        ref={inputRef}
        value={value}
      >
        {allowedValues.map(item => (
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
        {allowedValues.map(item => (
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
  const isCustomOther = !values.includes(value);
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
              onChange(val, props.name);
            }}
            label="Préciser"
            className="mb-8"
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
