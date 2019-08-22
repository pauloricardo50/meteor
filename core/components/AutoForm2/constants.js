export const CUSTOM_AUTOFIELD_TYPES = {
  DATE: 'DATE',
  PERCENT: 'PERCENT',
  TEXT_AREA: 'TEXT_AREA',
  MONEY: 'MONEY',
  MONEY_DECIMAL: 'MONEY_DECIMAL',
  HTML_PREVIEW: 'HTML_PREVIEW',
  BOOLEAN_RADIO: 'BOOLEAN_RADIO',
};

// Use internally to manage exceptions
export const COMPONENT_TYPES = {
  ARRAY: 'ARRAY',
  DATE: 'DATE',
  PERCENT: 'PERCENT',
  SELECT: 'SELECT',
  TEXT_AREA: 'TEXT_AREA',
  MONEY: 'MONEY',
  RENDER: 'RENDER',
  HTML_PREVIEW: 'HTML_PREVIEW',
  BOOLEAN_RADIO: 'BOOLEAN_RADIO',
};

export const FIELDS_TO_IGNORE = [
  'label',
  'field',
  'fields',
  'uniforms',
  'InputLabelProps',
  'onChange',
  'model',
  'changedMap',
];
