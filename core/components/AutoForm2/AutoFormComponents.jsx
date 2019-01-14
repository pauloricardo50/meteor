// @flow
import React from 'react';
import AutoField from 'uniforms-material/AutoField';
import connectField from 'uniforms/connectField';
import { compose } from 'recompose';
import { injectIntl } from 'react-intl';

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

export const makeCustomAutoField = ({ labels = {}, intlPrefix } = {}) =>
  compose(
    injectIntl,
    connectField,
  )(
    (props) => {
      let {
        Component,
        type,
        props: additionalProps = {},
      } = determineComponentFromProps(props);
      Component = Component || AutoField;

      const label = getLabel({
        ...props,
        intlPrefix,
        label: labels[props.name],
      });
      const placeholder = getPlaceholder({ ...props, intlPrefix, type });

      return (
        <Component
          {...additionalProps}
          {...props}
          label={label}
          placeholder={placeholder}
          InputLabelProps={{ shrink: true }}
        />
      );
    },
    { includeInChain: false, includeParent: true },
  );

export const CustomAutoField = makeCustomAutoField({});
