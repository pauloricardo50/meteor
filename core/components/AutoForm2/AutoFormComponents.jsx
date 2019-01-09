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

const determineComponentFromProps = ({
  allowedValues,
  customAllowedValues,
  customAllowedValuesFromQuery,
  field: { uniforms },
  fieldType,
}) => {
  if (allowedValues || customAllowedValues || customAllowedValuesFromQuery) {
    return { Component: CustomSelectField, type: COMPONENT_TYPES.SELECT };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.DATE) {
    return { Component: DateField, type: COMPONENT_TYPES.DATE };
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.PERCENT) {
    return { Component: PercentField, type: COMPONENT_TYPES.PERCENT };
  }

  if (fieldType === Array) {
    return { Component: CustomListField, type: COMPONENT_TYPES.ARRAY };
  }

  if (fieldType === Object) {
    return { Component: CustomNestField, type: COMPONENT_TYPES.ARRAY };
  }

  return { Component: false, type: null };
};

export const makeCustomAutoField = ({ labels = {}, intlPrefix } = {}) =>
  compose(
    injectIntl,
    connectField,
  )(
    (props) => {
      let { Component, type } = determineComponentFromProps(props);
      Component = Component || AutoField;

      const label = getLabel({
        ...props,
        intlPrefix,
        label: labels[props.name],
      });
      const placeholder = getPlaceholder({ ...props, intlPrefix, type });

      return (
        <Component
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
