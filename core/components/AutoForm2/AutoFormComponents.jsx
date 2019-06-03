// @flow
import React from 'react';
import AutoField from 'uniforms-material/AutoField';
import connectField from 'uniforms/connectField';
import { compose, getContext } from 'recompose';
import { intlShape } from 'react-intl';
import nothing from 'uniforms/nothing';
import BoolField from 'uniforms-material/BoolField';

import DateField from '../DateField';
import { PercentField } from '../PercentInput';
import {
  CUSTOM_AUTOFIELD_TYPES,
  COMPONENT_TYPES,
  FIELDS_TO_IGNORE,
} from './constants';
import CustomSelectField from './CustomSelectField';
import { OptimizedListField } from './CustomListField';
import CustomNestField from './CustomNestField';
import { getLabel, getPlaceholder } from './autoFormHelpers';
import MoneyInput from '../MoneyInput';
import HtmlPreview from '../HtmlPreview';
import { ignoreProps } from '../../containers/updateForProps';

const container = ignoreProps(FIELDS_TO_IGNORE);

const OptimizedMoneyInput = container(MoneyInput);
const OptimizedDateField = container(DateField);
const OptimizedPercentField = container(PercentField);
const OptimizedBoolField = container(BoolField);

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
    return { Component: OptimizedDateField, type: COMPONENT_TYPES.DATE };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.PERCENT) {
    return { Component: OptimizedPercentField, type: COMPONENT_TYPES.PERCENT };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.MONEY) {
    return {
      Component: OptimizedMoneyInput,
      type: COMPONENT_TYPES.MONEY,
      props: { margin: 'normal' },
    };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.HTML_PREVIEW) {
    return {
      Component: HtmlPreview,
      type: COMPONENT_TYPES.HTML_PREVIEW,
    };
  }

  if (fieldType === Array) {
    return { Component: OptimizedListField, type: COMPONENT_TYPES.ARRAY };
  }

  if (fieldType === Object) {
    return { Component: CustomNestField, type: COMPONENT_TYPES.ARRAY };
  }

  if (fieldType === Boolean) {
    return { Component: OptimizedBoolField };
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
      && !condition(model, props.parent && Number(props.parent.name.slice(-1)))
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
        margin="normal"
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
