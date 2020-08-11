import React, { useState } from 'react';
import { compose } from 'recompose';
import { connectField } from 'uniforms';

import { ignoreProps } from '../../../containers/updateForProps';
import TextInput from '../../TextInput';
import { OTHER_ALLOWED_VALUE } from '../autoFormConstants';
import { RenderCheckboxes, RenderSelect } from './customSelectFieldHelpers';
import useCustomSelectField from './useCustomSelectField';

const Select = ({ checkboxes, ...props }) =>
  checkboxes ? <RenderCheckboxes {...props} /> : <RenderSelect {...props} />;

Select.defaultProps = {
  appearance: 'checkbox',
  fullWidth: true,
  margin: 'dense',
};

const SelectField = connectField(Select);

const CustomSelectField = ({
  allowedValues,
  allowedValuesIntlId,
  customAllowedValues,
  data: initialData,
  deps,
  disabled: isDisabled,
  displayEmpty,
  intlId,
  model,
  name,
  onChange,
  parent,
  placeholder,
  recommendedValues,
  transform: transformFunc,
  value,
  withCustomOther,
  uniforms,
  ...props
}) => {
  const {
    data,
    error,
    formatOption,
    isDisabled: disabled,
    renderValue,
    transform,
    values,
  } = useCustomSelectField({
    allowedValues,
    allowedValuesIntlId,
    customAllowedValues,
    data: initialData,
    deps,
    disabled: isDisabled,
    displayEmpty,
    intlId,
    model,
    name,
    parent,
    placeholder,
    recommendedValues,
    transform: transformFunc,
    value,
    withCustomOther,
  });
  const isCustomOther = withCustomOther && !values.includes(value);
  const [customOther, setCustomOther] = useState(
    isCustomOther ? value : undefined,
  );
  const [displayCustomOther, setDisplayCustomOther] = useState(isCustomOther);

  if (error) {
    return <span className="error">{error.message || error.reason}</span>;
  }

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
        disabled={disabled}
        formatOption={formatOption}
        data={data}
        nullable={uniforms.nullable}
        displayEmpty
        name={name}
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
  React.memo,
  ignoreProps(['label', 'InputLabelProps', 'onChange', 'changedMap']),
)(CustomSelectField);
