// @flow
import React from 'react';
import AutoField from 'uniforms-material/AutoField';
import connectField from 'uniforms/connectField';
import { compose, getContext } from 'recompose';
import { intlShape } from 'react-intl';
import nothing from 'uniforms/nothing';

import DateField from '../DateField';
import { PercentField } from '../PercentInput';
import { CUSTOM_AUTOFIELD_TYPES, COMPONENT_TYPES } from './constants';
import CustomSelectField from './CustomSelectField';
import CustomListField from './CustomListField';
import CustomNestField from './CustomNestField';
import { getLabel, getPlaceholder } from './autoFormHelpers';
import MoneyInput from '../MoneyInput';

const determineComponentFromProps = ({
  allowedValues,
  customAllowedValues,
  field: { uniforms },
  fieldType,
}) => {
  if (allowedValues || customAllowedValues) {
    return { Component: CustomSelectField, type: COMPONENT_TYPES.SELECT };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.DATE) {
    return { Component: DateField, type: COMPONENT_TYPES.DATE };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.PERCENT) {
    return { Component: PercentField, type: COMPONENT_TYPES.PERCENT };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.MONEY) {
    return {
      Component: MoneyInput,
      type: COMPONENT_TYPES.MONEY,
      props: { margin: 'normal' },
    };
  }

  if (fieldType === Array) {
    return { Component: CustomListField, type: COMPONENT_TYPES.ARRAY };
  }

  if (fieldType === Object) {
    return { Component: CustomNestField, type: COMPONENT_TYPES.ARRAY };
  }

  if (uniforms && uniforms.render) {
    return { Component: uniforms.render, type: COMPONENT_TYPES.RENDER };
  }

  return { Component: false, type: null };
};

export const makeCustomAutoField = ({ labels = {}, intlPrefix } = {}) => {
  const CustomAutoField = (
    props,
    {
      uniforms: {
        schema,
        model,
        state: { submitting },
      },
    },
  ) => {
    const { condition, customAllowedValues, customAutoValue } = schema.getField(props.name);

    let {
      Component,
      type,
      props: additionalProps = {},
    } = determineComponentFromProps({
      ...props,
      customAllowedValues,
      model,
      submitting,
      condition,
    });
    Component = Component || AutoField;

    let autoValue;

    if (typeof customAutoValue === 'function') {
      autoValue = customAutoValue(model);
    }

    const label = getLabel({
      ...props,
      intlPrefix,
      label: labels[props.name],
    });
    const placeholder = getPlaceholder({ ...props, intlPrefix, type });

    if (
      typeof condition === 'function'
      && !condition(model, parent && Number(props.parent.name.slice(-1)))
    ) {
      return nothing;
    }

    return (
      <Component
        {...additionalProps}
        {...props}
        {...(autoValue ? { value: autoValue } : {})}
        model={model}
        submitting={submitting}
        customAllowedValues={customAllowedValues}
        label={label}
        placeholder={placeholder}
        InputLabelProps={{ shrink: true }}
      />
    );
  };

  CustomAutoField.contextTypes = AutoField.contextTypes;

  return compose(
    getContext({ intl: intlShape, ...AutoField.contextTypes }),
    connectField,
  )(CustomAutoField, { includeInChain: false, includeParent: true });
};

export const CustomAutoField = makeCustomAutoField({});
