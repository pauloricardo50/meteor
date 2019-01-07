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

  return (
    overrideLabel
    || label
    || (uniforms && uniforms.label) || (
      <T id={formatStringId({ intlPrefix, intlId, name, parent })} />
    )
  );
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
  if (fieldType === Boolean) {
    return '';
  }

  if (fieldType === Array) {
    return placeholder;
  }

  // When you set placeholder to `false`, it sets the default placeholder to
  // an empty string
  if (!placeholdersAreEnabled({ placeholder, parent })) {
    return '';
  }

  if (uniforms && uniforms.placeholder !== undefined) {
    return uniforms.placeholder
      ? `p.ex: ${uniforms.placeholder}`
      : uniforms.placeholder;
  }
  // Let select fields manage their own null states
  if (type === COMPONENT_TYPES.SELECT) {
    return '';
  }

  return `p.ex: ${formatMessage({
    id: `${formatStringId({
      intlPrefix,
      intlId,
      name,
      parent,
    })}.placeholder`,
  })}`;
};
