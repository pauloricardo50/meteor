import React from 'react';

import T from '../Translation';
import { COMPONENT_TYPES } from './constants';

const formatStringId = ({ intlId, name, intlPrefix, parent }) => {
  const start = `${intlPrefix || 'Forms'}.`;
  let end = name;

  if (parent) {
    const nameWithoutDots = name.replace(/\.\d+$/g, '');
    const nameWithoutDot2 = nameWithoutDots.replace(/\.\d+\./g, '.');
    end = nameWithoutDot2;
  }

  if (intlId) {
    end = intlId;
  }

  return start + end;
};

const flowProps = arr =>
  arr.reduce((val, i) => {
    if (val === null) {
      return null;
    }
    if (val) {
      return val;
    }

    return i;
  }, '');

const oneIsNull = arr => arr.some(i => i === null);

export const getLabel = ({
  name,
  field: { uniforms },
  overrideLabel,
  intlId,
  intlPrefix,
  label,
  isListField,
  parent,
}) => {
  if (label === null) {
    return null;
  }

  if (isListField) {
    return null;
  }

  return flowProps([
    overrideLabel,
    label,
    uniforms && uniforms.label,
    <T id={formatStringId({ intlPrefix, intlId, name, parent })} />,
  ]);
};

const placeholdersAreEnabled = ({ placeholder, parent }) => {
  if (parent) {
    return parent.placeholder !== '';
  }

  return placeholder !== '';
};

export const getPlaceholder = ({
  field: { uniforms },
  fieldType,
  intl: { formatMessage },
  intlId,
  intlPrefix,
  name,
  placeholder,
  type,
  parent,
}) => {
  let placeholderPrefix = 'p.ex: ';

  // Doesn't make sense to add example prefix on select field
  if (type === COMPONENT_TYPES.SELECT) {
    placeholderPrefix = '';
  }

  if (fieldType === Boolean || fieldType === Date) {
    return '';
  }

  if (fieldType === Array) {
    return placeholder;
  }

  if (uniforms && uniforms.placeholder !== undefined) {
    return uniforms.placeholder
      ? `${placeholderPrefix}${uniforms.placeholder}`
      : uniforms.placeholder;
  }
  // When you set placeholder to `false`, it sets the default placeholder to
  // an empty string
  if (!placeholdersAreEnabled({ placeholder, parent })) {
    return '';
  }

  if (oneIsNull([placeholder, uniforms && uniforms.placeholder])) {
    return '';
  }

  // Let select fields manage their own null states
  if (type === COMPONENT_TYPES.PERCENT) {
    return '';
  }

  if (type === COMPONENT_TYPES.SELECT) {
    return formatMessage({ id: 'general.pick' });
  }

  return `${placeholderPrefix}${formatMessage({
    id: `${formatStringId({
      intlPrefix,
      intlId,
      name,
      parent,
    })}.placeholder`,
  })}`;
};
