import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { compose, getContext } from 'recompose';
import { connectField, nothing } from 'uniforms';
import { AutoField, BoolField } from 'uniforms-material';

import { ignoreProps } from '../../containers/updateForProps';
import DateField from '../DateField';
import HtmlPreview from '../HtmlPreview';
import MoneyInput from '../MoneyInput';
import PercentInput from '../PercentInput';
import {
  COMPONENT_TYPES,
  CUSTOM_AUTOFIELD_TYPES,
  FIELDS_TO_IGNORE,
} from './autoFormConstants';
import { useAutoFormContext } from './AutoFormContext';
import { getLabel, getPlaceholder } from './autoFormHelpers';
import CustomBooleanRadioField from './CustomBooleanRadioField';
import { OptimizedListField } from './CustomListField';
import CustomNestField from './CustomNestField';
import CustomSelectField from './CustomSelectField';
import FileUploadField from './FileUploadField/loadable';

const container = ignoreProps(FIELDS_TO_IGNORE);

const OptimizedMoneyInput = container(MoneyInput);
const OptimizedDateField = container(DateField);
const OptimizedPercentInput = container(PercentInput);
const OptimizedBoolField = container(BoolField);

const determineComponentFromProps = ({
  allowedValues,
  customAllowedValues,
  field: { uniforms },
  fieldType,
}) => {
  if (
    allowedValues ||
    customAllowedValues ||
    (uniforms && uniforms.recommendedValues)
  ) {
    return {
      Component: CustomSelectField,
      type: COMPONENT_TYPES.SELECT,
    };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.DATE) {
    const { getProps = () => {} } = uniforms;
    return {
      Component: OptimizedDateField,
      type: COMPONENT_TYPES.DATE,
      props: { placeholder: null, getProps },
    };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.PERCENT) {
    return { Component: OptimizedPercentInput, type: COMPONENT_TYPES.PERCENT };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.MONEY) {
    return {
      Component: OptimizedMoneyInput,
      type: COMPONENT_TYPES.MONEY,
    };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.MONEY_DECIMAL) {
    return {
      Component: OptimizedMoneyInput,
      type: COMPONENT_TYPES.MONEY,
      props: { decimal: true },
    };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.MONEY_NEGATIVE) {
    return {
      Component: OptimizedMoneyInput,
      type: COMPONENT_TYPES.MONEY,
      props: { negative: true },
    };
  }

  if (
    uniforms &&
    uniforms.type === CUSTOM_AUTOFIELD_TYPES.MONEY_NEGATIVE_DECIMAL
  ) {
    return {
      Component: OptimizedMoneyInput,
      type: COMPONENT_TYPES.MONEY,
      props: {
        decimal: true,
        negative: true,
      },
    };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.HTML_PREVIEW) {
    return {
      Component: HtmlPreview,
      type: COMPONENT_TYPES.HTML_PREVIEW,
      props: { placeholder: null },
    };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.BOOLEAN_RADIO) {
    return {
      Component: CustomBooleanRadioField,
      type: COMPONENT_TYPES.BOOLEAN_RADIO,
      props: { placeholder: null },
    };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.FILE_UPLOAD) {
    return { Component: FileUploadField };
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
    return {
      Component: uniforms.render,
      type: COMPONENT_TYPES.RENDER,
      props: { placeholder: null },
    };
  }

  return {
    Component: false,
    type: null,
    props: { variant: 'outlined', size: 'small' },
  };
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
    const intl = useIntl();
    const { transformIntlId } = useAutoFormContext();
    const { allowedValues, field, fieldType, margin = 'normal' } = props;

    const { condition, customAllowedValues, customAutoValue } = schema.getField(
      props.name,
    );

    let { Component, type, props: additionalProps = {} } = useMemo(
      () =>
        determineComponentFromProps({
          allowedValues,
          customAllowedValues,
          field,
          fieldType,
        }),
      [],
    );

    Component = Component || AutoField;

    let autoValue;

    if (typeof customAutoValue === 'function') {
      autoValue = customAutoValue(model);
    }

    // Don't recalculate these
    const label = useMemo(
      () =>
        getLabel({
          ...props,
          ...additionalProps,
          intlPrefix,
          label: labels[props.name],
          transformIntlId,
        }),
      [],
    );
    const placeholder = useMemo(
      () =>
        getPlaceholder({
          ...props,
          ...additionalProps,
          intl,
          intlPrefix,
          type,
        }),
      [],
    );

    if (
      typeof condition === 'function' &&
      !condition(model, props.parent && Number(props.parent.name.slice(-1)))
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
        margin={margin}
      />
    );
  };

  CustomAutoField.contextTypes = AutoField.contextTypes;

  return compose(
    getContext(AutoField.contextTypes),
    connectField,
  )(CustomAutoField, { includeInChain: false, includeParent: true });
};

export const CustomAutoField = makeCustomAutoField();
