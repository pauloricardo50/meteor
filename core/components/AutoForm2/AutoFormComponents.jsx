// @flow
import React from 'react';
import AutoField from 'uniforms-material/AutoField';
import connectField from 'uniforms/connectField';

import { compose } from 'recompose';
import { injectIntl } from 'react-intl';
import T from '../Translation';
import { CUSTOM_AUTOFIELD_TYPES } from './constants';
import DateField from '../DateField';
import { PercentField } from '../PercentInput';
import CustomSelectField from './CustomSelectField';

// Use internally to manage exceptions
const COMPONENT_TYPES = {
  SELECT: 'SELECT',
  DATE: 'DATE',
  PERCENT: 'PERCENT',
};

const determineComponentFromProps = ({
  allowedValues,
  customAllowedValues,
  customAllowedValuesFromQuery,
  field: { uniforms },
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

  return { Component: false, type: null };
};

const formatStringId = ({ intlId, name, intlPrefix }) =>
  `${intlPrefix || 'Forms'}.${intlId || name}`;

const getLabel = ({
  name,
  field: { uniforms },
  overrideLabel,
  intlId,
  intlPrefix,
  label,
}) => {
  if (label === null) {
    return null;
  }

  return (
    overrideLabel
    || label
    || (uniforms && uniforms.label) || (
      <T id={formatStringId({ intlPrefix, intlId, name })} />
    )
  );
};

const getPlaceholder = ({
  intl: { formatMessage },
  name,
  intlId,
  intlPrefix,
  type,
  field: { uniforms },
  placeholder,
}) => {
  // When you set placeholder to `false`, it sets the default placeholder to
  // an empty string
  if (placeholder === '') {
    return '';
  }

  if (uniforms && uniforms.placeholder !== undefined) {
    return uniforms.placeholder;
  }
  // Let select fields manage their own null states
  if (type === COMPONENT_TYPES.SELECT) {
    return '';
  }

  return formatMessage({
    id: `${formatStringId({ intlPrefix, intlId, name })}.placeholder`,
  });
};
export const makeCustomAutoField = ({ labels = {}, intlPrefix } = {}) =>
  compose(
    injectIntl,
    connectField,
  )(
    (props) => {
      let { Component, type } = determineComponentFromProps(props);
      console.log('props', props);
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
    { includeInChain: false },
  );

export const CustomAutoField = makeCustomAutoField({});
