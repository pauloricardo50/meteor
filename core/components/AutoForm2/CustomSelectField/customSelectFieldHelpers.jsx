import React, { useMemo } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import { filterDOMProps } from 'uniforms';
import { wrapField } from 'uniforms-material';

import Checkbox from '../../Material/Checkbox';
import MenuItem from '../../Material/MenuItem';
import Radio, { RadioGroup } from '../../Material/Radio';
import Switch from '../../Material/Switch';
import TextField from '../../Material/TextField';
import { mapSelectOptions } from '../../Select/selectHelpers';

const xor = (item, array) => {
  const index = array.indexOf(item);

  if (index === -1) {
    return array.concat([item]);
  }

  return array.slice(0, index).concat(array.slice(index + 1));
};

const useStyles = makeStyles({
  multiple: {
    paddingTop: 6.5,
    paddingBottom: 6.5,
  },
});

export const RenderSelect = ({
  allowedValues,
  data = [],
  disabled,
  error,
  errorMessage,
  fieldType,
  fullWidth,
  grouping,
  helperText,
  id,
  InputLabelProps,
  inputProps,
  label,
  labelProps,
  margin,
  name,
  native,
  nullable,
  onChange,
  placeholder,
  required,
  showInlineError,
  transform,
  value,
  variant,
  ...props
}) => {
  const classes = useStyles();
  const hasPlaceholder = !!placeholder;
  const hasValue = value !== '' && value !== undefined;

  const mappedOptions = useMemo(() => {
    const options = allowedValues.map(v => {
      // Make this data available for grouping
      const rest = data?.filter(x => x?._id).find(({ _id }) => _id === v);
      return { id: v, label: transform(v), ...rest };
    });

    return mapSelectOptions(options, grouping);
  }, [allowedValues]);
  const multiple = fieldType === Array || undefined;

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
        multiple,
        native,
        MenuProps: { PaperProps: { style: { maxHeight: 400 } } },
        classes: { root: multiple ? classes.multiple : undefined },
        ...filterDOMProps(props),
      }}
      value={native && !value ? '' : value}
      id={id}
      data-testid={mappedOptions?.length ? 'ready' : ''}
    >
      {hasPlaceholder && (
        <MenuItem value="" disabled={nullable}>
          <i className="secondary">{placeholder}</i>
        </MenuItem>
      )}
      {mappedOptions}
    </TextField>
  );
};

export const RenderCheckboxes = ({
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
  nullable,
  onChange,
  showInlineError,
  transform,
  value,
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
